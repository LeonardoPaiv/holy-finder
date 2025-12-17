import { useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/services/postService';

interface Filters {
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

export function useInfinitePosts(cnpj: string, filters: Filters = {}) {
  const query = useInfiniteQuery({
    queryKey: ['posts', cnpj, filters],
    queryFn: ({ pageParam = 1 }) => 
      PostService.getPosts(cnpj, { ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled: !!cnpj,
    staleTime: 30000, // 30 seconds
  });

  const posts = query.data?.pages.flatMap((page: any) => page.posts) || [];

  return {
    ...query,
    posts,
  };
}
