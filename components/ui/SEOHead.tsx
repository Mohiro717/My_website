import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Mohiro's Portfolio & Blog",
  description = "Mohiroのポートフォリオとブログサイト。Web開発、デザイン、技術についての記事を発信しています。",
  keywords = "portfolio, blog, web development, design, React, TypeScript, Next.js",
  image = "/images/ogp.jpg",
  url = "https://mohiro.vercel.app",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Mohiro",
  tags = []
}) => {
  const fullTitle = title.includes("Mohiro") ? title : `${title} | Mohiro's Portfolio & Blog`;
  const fullUrl = url.startsWith('http') ? url : `https://mohiro.vercel.app${url}`;
  const fullImage = image.startsWith('http') ? image : `https://mohiro.vercel.app${image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type === "article" ? "BlogPosting" : "WebSite",
        "@id": `${fullUrl}#${type}`,
        "url": fullUrl,
        "name": fullTitle,
        "description": description,
        ...(type === "article" && {
          "headline": title,
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://mohiro.vercel.app"
          },
          "publisher": {
            "@type": "Person",
            "name": "Mohiro",
            "url": "https://mohiro.vercel.app"
          },
          "keywords": tags.join(", "),
          "articleSection": "Technology"
        }),
        "image": {
          "@type": "ImageObject",
          "url": fullImage,
          "width": 1200,
          "height": 630
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${fullUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Person",
        "@id": "https://mohiro.vercel.app/#person",
        "name": "Mohiro",
        "url": "https://mohiro.vercel.app",
        "sameAs": [
          "https://github.com/mohiro",
          "https://twitter.com/mohiro"
        ],
        "jobTitle": "Web Developer & Designer",
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance"
        }
      }
    ]
  };

  React.useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', fullImage, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', "Mohiro's Portfolio & Blog", true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImage);
    updateMetaTag('twitter:creator', '@mohiro');

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      updateMetaTag('article:author', author, true);
      tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.setAttribute('content', tag);
        document.head.appendChild(tagMeta);
      });
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Update structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);

    return () => {
      // Cleanup article tags on unmount
      if (type === 'article') {
        const articleTags = document.querySelectorAll('meta[property="article:tag"]');
        articleTags.forEach(tag => tag.remove());
      }
    };
  }, [fullTitle, description, keywords, fullImage, fullUrl, type, publishedTime, modifiedTime, author, tags]);

  return null; // This component doesn't render anything
};

export default SEOHead;