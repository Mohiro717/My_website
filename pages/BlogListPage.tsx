
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanityService, urlFor } from '../services/sanityService';
import type { Post, Category, Tag as TagType } from '../types';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import Spinner from '../components/ui/Spinner';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPosts, fetchedCategories, fetchedTags] = await Promise.all([
          sanityService.getPosts(),
          sanityService.getCategories(),
          sanityService.getTags(),
        ]);
        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post =>
        selectedCategory ? (post.categories ?? []).some(c => c._id === selectedCategory) : true
      )
      .filter(post =>
        selectedTag ? (post.tags ?? []).some(t => t._id === selectedTag) : true
      );
  }, [posts, searchTerm, selectedCategory, selectedTag]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-4xl sm:text-5xl font-bold font-serif text-center mb-12 text-main-text">Blog</h1>
      
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-blue focus:border-accent-blue transition"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-blue focus:border-accent-blue transition bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.title}</option>)}
        </select>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-blue focus:border-accent-blue transition bg-white"
        >
          <option value="">All Tags</option>
          {tags.map(tag => <option key={tag._id} value={tag._id}>{tag.title}</option>)}
        </select>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Card key={post._id} onClick={() => navigate(`/blog/${post.slug.current}`)}>
              {post.mainImage ? (
                <img src={urlFor(post.mainImage).width(600).height(400).url()} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <img src="https://picsum.photos/600/400" alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex flex-col h-64">
                <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(post.categories ?? []).map(cat => <Tag key={cat._id}>{cat.title}</Tag>)}
                    </div>
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
          <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 text-lg">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
