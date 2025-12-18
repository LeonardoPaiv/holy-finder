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

  // Map posts and ensure cnpj data is included
  const posts = query.data?.pages.flatMap((page: any) => 
    page.posts.map((post: any) => ({
      ...post,
      cnpj: post.cnpj || { _id: cnpj, name: 'Instituição' }
    }))
  ) || [];

  return {
    ...query,
    posts,
  };
}
