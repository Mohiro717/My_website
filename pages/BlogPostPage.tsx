import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanityService, urlFor } from '../services/sanityService';
import type { Post } from '../types';
import Spinner from '../components/ui/Spinner';
import Tag from '../components/ui/Tag';
import { slugify } from '../utils/slugify';

type HeadingSlugMap = Map<string, string>;

type PortableTextProps = {
  blocks: any[];
  headingSlugMap: HeadingSlugMap;
};

const PortableText: React.FC<PortableTextProps> = ({ blocks, headingSlugMap }) => (
  <div>
    {blocks.map((block, index) => {
      if (block?._type === 'image' && block.asset?._ref) {
        const key = block._key ?? index;
        const builder = urlFor(block);
        const imageUrl =
          builder && typeof builder.width === 'function' && typeof builder.url === 'function'
            ? builder.width(1200).fit?.('max')?.quality?.(85).url() ?? builder.width(1200).url()
            : '';

        if (!imageUrl) {
          return null;
        }

        return (
          <figure key={key} className="my-6">
            <img
              src={imageUrl}
              alt={block.alt || ''}
              className="w-full rounded-lg shadow-md"
              loading="lazy"
            />
            {block.alt ? (
              <figcaption className="text-sm text-center text-gray-500 mt-2">{block.alt}</figcaption>
            ) : null}
          </figure>
        );
      }

      if (block?._type !== 'block') return null;

      const style = block.style || 'normal';
      const text = (block.children ?? []).map((span: any) => span.text ?? '').join('');
      const trimmed = text.trim();

      if (!trimmed) {
        return null;
      }

      const key = block._key ?? index;
      const headingId = headingSlugMap.get(block._key) ?? slugify(trimmed);

      switch (style) {
        case 'h2':
          return (
            <h2 id={headingId} key={key} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
              {trimmed}
            </h2>
          );
        case 'h3':
          return (
            <h3 id={headingId} key={key} className="text-xl font-bold mt-6 mb-3 scroll-mt-24">
              {trimmed}
            </h3>
          );
        case 'h4':
          return (
            <h4 id={headingId} key={key} className="text-lg font-semibold mt-4 mb-2 scroll-mt-24">
              {trimmed}
            </h4>
          );
        case 'blockquote':
          return (
            <blockquote key={key} className="border-l-4 border-accent-blue pl-4 italic my-4">
              {trimmed}
            </blockquote>
          );
        default:
          return (
            <p key={key} className="my-4 leading-relaxed">
              {trimmed}
            </p>
          );
      }
    })}
  </div>
);

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const incrementedRef = useRef(false);

  const { tableOfContents, headingSlugMap } = useMemo(() => {
    if (!post?.body) {
      return {
        tableOfContents: [] as Array<{ key: string; slug: string; text: string; level: number }>,
        headingSlugMap: new Map<string, string>()
      };
    }

    const slugCounts = new Map<string, number>();
    const headingSlugs: HeadingSlugMap = new Map();
    const toc: Array<{ key: string; slug: string; text: string; level: number }> = [];

    post.body.forEach((block: any, idx: number) => {
      if (block?._type !== 'block') return;
      if (!['h2', 'h3', 'h4'].includes(block.style)) return;

      const text = (block.children ?? []).map((span: any) => span.text ?? '').join('').trim();
      if (!text) return;

      const baseSlug = slugify(text);
      const count = slugCounts.get(baseSlug) ?? 0;
      const uniqueSlug = count > 0 ? `${baseSlug}-${count}` : baseSlug;
      slugCounts.set(baseSlug, count + 1);

      if (block._key) {
        headingSlugs.set(block._key, uniqueSlug);
      }

      toc.push({
        key: block._key ?? `${uniqueSlug}-${idx}`,
        slug: uniqueSlug,
        text,
        level: Number(block.style?.replace('h', '')) || 2
      });
    });

    return { tableOfContents: toc, headingSlugMap: headingSlugs };
  }, [post]);

  useEffect(() => {
    if (!slug) return;
    incrementedRef.current = false;

    const fetchPost = async () => {
      try {
        const fetchedPost = await sanityService.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError('Failed to fetch post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const incrementView = async () => {
      if (!post || incrementedRef.current) return;
      if (!post.slug?.current) return;

      incrementedRef.current = true;

      try {
        const response = await fetch('/api/increment-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ slug: post.slug.current })
        });

        if (response.ok) {
          const data = await response.json();
          setPost(prev => (prev ? { ...prev, viewCount: typeof data.viewCount === 'number' ? data.viewCount : prev.viewCount } : prev));
        }
      } catch (incrementError) {
        if (import.meta.env.DEV) {
          console.warn('View count increment failed in dev environment.', incrementError);
        }
      }
    };

    incrementView();
  }, [post]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return null;

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">{post.title}</h1>
        <div className="text-center text-gray-500 text-sm">
          <span>
            Published on {new Date(post.publishedAt).toLocaleDateString()} by {post.author.name}
            {' '}•{' '}
            {(post.viewCount ?? 0).toLocaleString()} views
          </span>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mt-4">
          {(post.categories ?? []).map(cat => (
            <Tag key={cat._id} onClick={() => navigate(`/blog/category/${cat.title.toLowerCase()}`)}>{cat.title}</Tag>
          ))}
          {(post.tags ?? []).map(tag => (
            <Tag key={tag._id} color="pink" onClick={() => navigate(`/blog/tag/${tag.title.toLowerCase()}`)}>{tag.title}</Tag>
          ))}
        </div>
      </header>

      {post.mainImage ? (
        <img src={urlFor(post.mainImage).width(1200).height(600).url()} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8" />
      ) : (
        <img src="https://picsum.photos/1200/600" alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8" />
      )}

      {tableOfContents.length > 0 && (
        <aside className="bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-main-text dark:text-gray-100">目次</h2>
          <ul className="space-y-2 text-sm text-accent-blue">
            {tableOfContents.map(item => (
              <li
                key={item.key}
                className={item.level === 3 ? 'ml-4' : item.level >= 4 ? 'ml-8' : ''}
              >
                <a href={`#${item.slug}`} className="hover:underline">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="prose lg:prose-xl max-w-none">
        <PortableText blocks={post.body} headingSlugMap={headingSlugMap} />
      </div>

      {/* Share Buttons */}
      <div className="mt-12 text-center">
        <h3 className="font-bold mb-4">Share this post</h3>
        <div className="flex justify-center space-x-4">
          {/* Dummy share links */}
          <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Facebook</a>
          <a href="#" className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition">Twitter</a>
          <a href="#" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition">LinkedIn</a>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
