
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sanityService, urlFor } from '../services/sanityService';
import type { Post } from '../types';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import Spinner from '../components/ui/Spinner';

interface FilteredBlogListPageProps {
  type: 'category' | 'tag';
}

const FilteredBlogListPage: React.FC<FilteredBlogListPageProps> = ({ type }) => {
  const params = useParams();
  const filterKey = type === 'category' ? params.category : params.tag;
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filterKey) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedPosts: Post[];
        if (type === 'category') {
          fetchedPosts = await sanityService.getPostsByCategory(filterKey);
        } else {
          fetchedPosts = await sanityService.getPostsByTag(filterKey);
        }
        setPosts(fetchedPosts);
      } catch (error) {
        console.error(`Failed to fetch posts by ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterKey, type]);
  
  const title = filterKey ? `${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}` : 'Filtered Posts';

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-gray-500 mb-2">Showing posts for {type}:</p>
        <h1 className="text-4xl sm:text-5xl font-bold font-serif text-main-text">{title}</h1>
        <Link to="/blog" className="mt-4 inline-block text-accent-blue hover:underline">
          &larr; Back to all posts
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map(post => (
            <Card key={post._id} onClick={() => navigate(`/blog/${post.slug.current}`)}>
              {post.mainImage ? (
                <img src={urlFor(post.mainImage).width(600).height(400).url()} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <img src="https://picsum.photos/600/400" alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex flex-col h-64">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2 h-14 overflow-hidden">{post.title}</h3>
                    <p className="text-gray-600 mb-4 h-20 overflow-hidden text-sm">{post.excerpt}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                    {(post.tags ?? []).slice(0, 3).map(tag => <Tag key={tag._id} color="pink">{tag.title}</Tag>)}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 text-lg">
            No posts found for this {type}.
          </p>
        )}
      </div>
    </div>
  );
};

export default FilteredBlogListPage;
