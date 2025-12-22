import { api } from '@/lib/apiClient';

export const PostReportService = {
  reportPost: async (postId: string, comment: string): Promise<{ message: string; reportCount: number }> => {
    try {
      const response = await api.post(`/api/posts/${postId}/report`, { comment });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to report post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },
};
