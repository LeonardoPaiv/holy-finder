import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedService } from '@/services/feedService';
import { useApp } from '@/components/AppContext';

export function useInfiniteFeedPosts() {
  const { religion, userLocation, feedFilters } = useApp();

  // Build query filters based on context
  const queryFilters = feedFilters.postId
    ? { postId: feedFilters.postId } // If postId is set, only use that
    : feedFilters.cnpj
    ? { cnpj: feedFilters.cnpj } // If cnpj is set, use that
    : userLocation
    ? { // Otherwise use geolocation
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 5,
        religion: religion
      }
    : {};

  const query = useInfiniteQuery({
    queryKey: ['feed-posts', queryFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await FeedService.getFeedPosts({ ...queryFilters, page: pageParam as number });
      
      // Handle single post response (when using postId)
      if (!result.pagination) {
        return {
          data: [result],
          pagination: {
            page: 1,
            limit: 1,
            total: 1,
            totalPages: 1,
            hasMore: false
          }
        };
      }
      
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      return lastPage.pagination?.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled: !!feedFilters.postId || !!feedFilters.cnpj || !!userLocation,
    staleTime: 30000, // 30 seconds
  });

  const posts = query.data?.pages.flatMap((page: any) => page.data) || [];

  return {
    ...query,
    posts,
  };
}
