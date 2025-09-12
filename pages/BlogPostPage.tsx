
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanityService, urlFor } from '../services/sanityService';
import type { Post } from '../types';
import Spinner from '../components/ui/Spinner';
import Tag from '../components/ui/Tag';

const PortableText: React.FC<{ blocks: any[] }> = ({ blocks }) => {
  return (
    <div>
      {blocks.map((block, index) => {
        if (block._type === 'block') {
          const style = block.style || 'normal';
          const text = block.children.map((span: any) => span.text).join('');

          switch (style) {
            case 'h2':
              return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{text}</h2>;
            case 'h3':
              return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{text}</h3>;
            case 'blockquote':
              return <blockquote key={index} className="border-l-4 border-accent-blue pl-4 italic my-4">{text}</blockquote>;
            default:
              return <p key={index} className="my-4 leading-relaxed">{text}</p>;
          }
        }
        return null;
      })}
    </div>
  );
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
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

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return null;

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">{post.title}</h1>
        <div className="text-center text-gray-500 text-sm">
          <span>Published on {new Date(post.publishedAt).toLocaleDateString()} by {post.author.name}</span>
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

      <div className="prose lg:prose-xl max-w-none">
        <PortableText blocks={post.body} />
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
