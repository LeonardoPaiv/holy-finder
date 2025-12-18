import { Post } from '../types';

interface FeedPostsResponse {
  data: (Post & {
    cnpj?: {
      _id: string;
      name: string;
    };
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface FeedFilters {
  lat?: number;
  lng?: number;
  radius?: number;
  religion?: string;
  cnpj?: string;
  postId?: string;
  page?: number;
  limit?: number;
}

export const FeedService = {
  getFeedPosts: async (filters: FeedFilters = {}): Promise<FeedPostsResponse> => {
    const params = new URLSearchParams({
      page: (filters.page || 1).toString(),
      limit: (filters.limit || 10).toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value !== undefined && !['page', 'limit'].includes(key)
        ).map(([key, value]) => [key, String(value)])
      )
    });

    const response = await fetch(`/api/feed/posts?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch feed posts');
    }

    return response.json();
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await fetch(`/api/feed/posts?postId=${postId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return response.json();
  }
};
