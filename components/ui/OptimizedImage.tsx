import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load 50px before image comes into view
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Generate WebP and fallback URLs
  const getOptimizedUrl = (originalSrc: string, format: 'webp' | 'original' = 'original') => {
    // If it's already a Sanity URL, use Sanity's optimization
    if (originalSrc.includes('cdn.sanity.io')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('fit', 'crop');
      params.append('auto', 'format');
      if (format === 'webp') params.append('fm', 'webp');
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}${params.toString()}`;
    }
    
    // For other URLs (like Picsum), return as-is
    return originalSrc;
  };

  const webpSrc = getOptimizedUrl(src, 'webp');
  const fallbackSrc = getOptimizedUrl(src);
  const placeholderSrc = placeholder || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width || 400} ${height || 300}'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E`;

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      {!inView && (
        <img
          src={placeholderSrc}
          alt=""
          className="w-full h-full object-cover filter blur-sm"
          aria-hidden="true"
        />
      )}
      
      {inView && !error && (
        <picture>
          <source 
            srcSet={webpSrc} 
            type="image/webp"
            sizes={sizes}
          />
          <img
            src={fallbackSrc}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}

      {error && (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {!loaded && inView && !error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;