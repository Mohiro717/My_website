const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE_NAME = `mohiro-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `mohiro-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `mohiro-images-${CACHE_VERSION}`;

const IMAGE_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Pre-cache static assets
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  // Static assets - Cache first
  static: [
    /\.(?:js|css|woff2?|png|jpg|jpeg|webp|gif|svg|ico)$/,
    /cdn\.tailwindcss\.com/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/
  ],
  // Images - Cache first with expiry
  images: [
    /images\.unsplash\.com/,
    /picsum\.photos/,
    /cdn\.sanity\.io/
  ],
  // API and dynamic content - Network first  
  dynamic: [
    /api/,
    /\.json$/
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing PWA Service Worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log('[SW] Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating PWA Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('mohiro-') && 
              ![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName)
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;
  
  // Determine cache strategy
  let strategy = 'network';
  
  if (CACHE_STRATEGIES.static.some(pattern => pattern.test(request.url))) {
    strategy = 'cacheFirst';
  } else if (CACHE_STRATEGIES.images.some(pattern => pattern.test(request.url))) {
    strategy = 'imageCache';
  } else if (CACHE_STRATEGIES.dynamic.some(pattern => pattern.test(request.url))) {
    strategy = 'networkFirst';
  } else if (request.mode === 'navigate') {
    strategy = 'networkFirst';
  }
  
  event.respondWith(handleRequest(request, strategy));
});

// Handle different caching strategies
async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request);
    case 'networkFirst':
      return networkFirst(request);
    case 'imageCache':
      return imageCache(request);
    default:
      return fetch(request);
  }
}

// Cache first strategy - for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses from same origin only
    if (networkResponse.ok && request.url.startsWith(self.location.origin)) {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.log('[SW] Cache put failed:', cacheError);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    const fallback = await caches.match('/');
    return fallback || new Response('Offline', { status: 503 });
  }
}

// Network first strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses from allowed origins
    if (networkResponse.ok && (
      request.url.startsWith(self.location.origin) || 
      request.url.includes('cdn.sanity.io')
    )) {
      try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.log('[SW] Cache put failed:', cacheError);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first fallback to cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return home page for navigation requests
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/');
      return fallback || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Image cache with expiry
async function imageCache(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid
    const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time'));
    const now = new Date();
    if (now - cachedTime < IMAGE_CACHE_TIME) {
      return cachedResponse;
    }
  }

  try {
    // Fetch new image and cache it
    const response = await fetch(request);
    if (response && response.status === 200) {
      try {
        const responseClone = response.clone();
        const headers = new Headers(responseClone.headers);
        headers.append('sw-cached-time', new Date().toISOString());
        
        const cachedResponse = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers: headers
        });

        await cache.put(request, cachedResponse);
      } catch (cacheError) {
        console.log('[SW] Image cache put failed:', cacheError);
      }
    }
    return response;
  } catch (error) {
    // Return cached version if network fails
    return cachedResponse || new Response('Image not available', { status: 503 });
  }
}