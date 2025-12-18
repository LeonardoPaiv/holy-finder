'use client';

import { useInfiniteFeedPosts } from '@/hooks/useInfiniteFeedPosts';
import { useApp } from '@/components/AppContext';
import FeedPostList from '@/components/feed/FeedPostList';

export default function FeedPage() {
  const { userLocation } = useApp();
  
  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteFeedPosts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-slate-800">Feed da Comunidade</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-24">
        {!userLocation ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">Ative sua localização para ver posts próximos</p>
            <p className="text-sm text-slate-500 mt-1">
              Precisamos da sua localização para mostrar posts relevantes
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
