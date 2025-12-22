import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/components/AppContext';

export const useFeedPageViewModel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userLocation, feedFilters, setFeedFilters, companies } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load filters from query params on mount and remove them from URL
  useEffect(() => {
    if (!mounted) return;

    const cnpj = searchParams.get('cnpj');
    const postId = searchParams.get('postId');
    
    if (cnpj || postId) {
      // Set filters from query params
      setFeedFilters({
        cnpj: cnpj || undefined,
        postId: postId || undefined,
      });

      // Remove query params from URL
      router.replace('/feed', { scroll: false });
    }
  }, [mounted, searchParams, setFeedFilters, router]);

  const handleFilterChange = (key: 'cnpj' | 'postId', value: string) => {
    setFeedFilters({
      ...feedFilters,
      [key]: value || undefined
    });
  };

  const handleClearFilters = () => {
    setFeedFilters({});
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  // Computed values
  const activeFiltersCount = Object.values(feedFilters).filter(Boolean).length;
  const hasFilters = !!feedFilters.cnpj || !!feedFilters.postId;
  const canShowPosts = hasFilters || !!userLocation;

  return {
    mounted,
    showFilters,
    feedFilters,
    companies,
    activeFiltersCount,
    hasFilters,
    canShowPosts,
    handleFilterChange,
    handleClearFilters,
    handleToggleFilters,
    handleCloseFilters,
  };
};
