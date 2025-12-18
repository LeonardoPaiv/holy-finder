import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedService } from '@/services/feedService';
import { useApp } from '@/components/AppContext';

interface FeedFilters {
  lat?: number;
  lng?: number;
  radius?: number;
  religion?: string;
  cnpj?: string;
}

export function useInfiniteFeedPosts(filters: FeedFilters = {}) {
  const { religion, userLocation } = useApp();

  // Use geolocation if available
  const queryFilters = userLocation 
    ? {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: filters.radius || 5,
        religion: filters.religion || religion,
        ...filters
      }
    : filters;

  const query = useInfiniteQuery({
    queryKey: ['feed-posts', queryFilters],
    queryFn: ({ pageParam = 1 }) => 
      FeedService.getFeedPosts({ ...queryFilters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled: !!userLocation || !!filters.cnpj, // Only fetch if we have location or CNPJ
    staleTime: 30000, // 30 seconds
  });

  const posts = query.data?.pages.flatMap((page: any) => page.data) || [];

  return {
    ...query,
    posts,
  };
}
