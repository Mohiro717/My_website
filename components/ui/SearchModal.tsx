import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanityService } from '../../services/sanityService';
import type { Post } from '../../types';
import Spinner from './Spinner';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // モーダルが開かれたときにフォーカスを当てる
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 最近の検索履歴を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 検索実行
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await sanityService.searchPosts(searchQuery);
      setResults(searchResults);
      
      // 検索履歴に追加
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5); // 最新5件まで保持
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // デバウンス処理付きの検索
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // 記事クリック時の処理
  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    onClose();
  };

  // 最近の検索クリック時の処理
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダル */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        {/* 検索バー */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事を検索..."
            className="flex-1 text-lg outline-none bg-transparent text-main-text dark:text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 結果エリア */}
        <div className="max-h-96 overflow-y-auto p-4">
          {loading && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              「{query}」に関する記事が見つかりませんでした
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                検索結果 ({results.length}件)
              </h3>
              {results.map((post) => (
                <div
                  key={post._id}
                  onClick={() => handlePostClick(post.slug.current)}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-main-text dark:text-gray-100 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag._id}
                        className="px-2 py-1 text-xs rounded bg-accent-blue/20 text-accent-blue"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && recentSearches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                最近の検索
              </h3>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-main-text dark:text-gray-100">{search}</span>
                </div>
              ))}
            </div>
          )}

          {!query && recentSearches.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              記事のタイトル、内容、タグから検索できます
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;