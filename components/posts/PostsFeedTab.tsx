'use client';

import { useEffect } from 'react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { useInstitutionPost } from '@/components/contexts/InstitutionPostContext';
import { useInfinitePosts } from '@/hooks/useInfinitePosts';
import { usePostFiltersViewModel } from '@/components/viewmodels/PostFiltersViewModel';
import MobileFilterToggle from './MobileFilterToggle';
import PostFilters from './PostFilters';
import PostList from './PostList';

export default function PostsFeedTab() {
  const { institution } = useInstitution();
  const { registerRefreshCallback } = useInstitutionPost();
  const {
    filters,
    showMobileFilters,
    handleFilterChange,
    handleClearFilters,
    toggleMobileFilters,
    closeMobileFilters,
    activeFiltersCount,
  } = usePostFiltersViewModel();

  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfinitePosts(institution?._id || '', filters);

  // Register refetch callback for when a new post is created
  useEffect(() => {
    registerRefreshCallback(() => {
      refetch();
    });
  }, [registerRefreshCallback, refetch]);

  if (!institution) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MobileFilterToggle
        onClick={toggleMobileFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <PostFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        showMobileFilters={showMobileFilters}
        onCloseMobile={closeMobileFilters}
      />

      <PostList
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        onRetry={() => refetch()}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
}
