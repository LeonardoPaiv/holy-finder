'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { useInfiniteFeedPosts } from '@/hooks/useInfiniteFeedPosts';
import { useApp } from '@/components/AppContext';
import FeedPostList from '@/components/feed/FeedPostList';

import { Suspense } from 'react';

function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userLocation, feedFilters, setFeedFilters, companies } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load filters from query params on mount
  useEffect(() => {
    const cnpj = searchParams.get('cnpj');
    const postId = searchParams.get('postId');
    
    if (cnpj || postId) {
      setFeedFilters({
        cnpj: cnpj || undefined,
        postId: postId || undefined,
      });
    }
  }, [searchParams, setFeedFilters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (feedFilters.cnpj) {
      params.set('cnpj', feedFilters.cnpj);
    }
    if (feedFilters.postId) {
      params.set('postId', feedFilters.postId);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/feed?${queryString}` : '/feed';
    
    // Only update if URL changed
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [feedFilters, router]);

  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteFeedPosts();

  const handleFilterChange = (key: 'cnpj' | 'postId', value: string) => {
    setFeedFilters({
      ...feedFilters,
      [key]: value || undefined
    });
  };

  const handleClearFilters = () => {
    setFeedFilters({});
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const activeFiltersCount = Object.values(feedFilters).filter(Boolean).length;
  const hasFilters = !!feedFilters.cnpj || !!feedFilters.postId;
  const canShowPosts = hasFilters || !!userLocation;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Feed da Comunidade</h1>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-24 space-y-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Filtros</h3>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <X size={16} />
                    <span>Limpar ({activeFiltersCount})</span>
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Institution Select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instituição
                </label>
                <select
                  value={feedFilters.cnpj || ''}
                  onChange={(e) => handleFilterChange('cnpj', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as instituições</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Post ID */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ID do Post
                </label>
                <input
                  type="text"
                  value={feedFilters.postId || ''}
                  onChange={(e) => handleFilterChange('postId', e.target.value)}
                  placeholder="ID do post"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {!canShowPosts ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">Ative sua localização ou selecione uma instituição</p>
            <p className="text-sm text-slate-500 mt-1">
              Use os filtros acima para ver posts
            </p>
          </div>
        ) : (
          <FeedPostList
            posts={posts}
            isLoading={isLoading}
            isError={isError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            onRetry={() => refetch()}
          />
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Carregando...</div>}>
      <FeedContent />
    </Suspense>
  );
}
