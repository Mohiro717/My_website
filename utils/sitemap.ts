import { sanityService } from '../services/sanityService';

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://mohiro-portfolio.vercel.app';
  
  // Static pages
  const staticPages = [
    { url: '', changefreq: 'monthly', priority: '1.0' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  ];

  // Dynamic pages (blog posts)
  let dynamicPages: Array<{url: string, changefreq: string, priority: string, lastmod?: string}> = [];
  
  try {
    const posts = await sanityService.getPosts();
    const categories = await sanityService.getCategories();
    const tags = await sanityService.getTags();

    // Blog posts
    dynamicPages = posts.map(post => ({
      url: `/blog/${post.slug.current}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined
    }));

    // Category pages
    const categoryPages = categories.map(category => ({
      url: `/blog/category/${category.slug.current}`,
      changefreq: 'weekly',
      priority: '0.6'
    }));

    // Tag pages
    const tagPages = tags.map(tag => ({
      url: `/blog/tag/${tag.slug.current}`,
      changefreq: 'weekly',
      priority: '0.5'
    }));

    dynamicPages = [...dynamicPages, ...categoryPages, ...tagPages];
  } catch (error) {
    console.error('Failed to fetch dynamic pages for sitemap:', error);
  }

  const allPages = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`)
  .join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRobots = (): string => {
  return `User-agent: *
Allow: /

# Important pages
Allow: /blog
Allow: /blog/*

# Sitemap location
Sitemap: https://mohiro-portfolio.vercel.app/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1`;
};