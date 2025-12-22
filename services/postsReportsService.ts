import { api } from '@/lib/apiClient';
import { PaginatedResult } from '@/types';

export interface PostsReportsFilters {
  cnpj?: string;
  postId?: string;
  postCreator?: string;
  status?: string;
}

export const PostsReportsService = {
  getPostsReports: async (
    filters: PostsReportsFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<any>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.cnpj) params.append('cnpj', filters.cnpj);
      if (filters.postId) params.append('postId', filters.postId);
      if (filters.postCreator) params.append('postCreator', filters.postCreator);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/api/moderation/posts-reports?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts reports:', error);
      throw error;
    }
  },
};
