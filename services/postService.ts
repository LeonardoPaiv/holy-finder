import { Post, PaginatedResult } from '../types';
import { api, apiClient } from '@/lib/apiClient';

interface PostsResponse {
  posts: (Post & {
    creator?: {
      _id: string;
      fullName: string;
    };
  })[];
  pagination: PaginatedResult<Post>;
}

interface PostFilters {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

export const PostService = {
  getPosts: async (cnpj: string, filters: PostFilters = {}): Promise<PostsResponse> => {
    const params = new URLSearchParams({
      page: (filters.page || 1).toString(),
      limit: (filters.limit || 10).toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value && !['page', 'limit'].includes(key)
        )
      )
    });

    const response = await api.get(`/api/companies/${cnpj}/posts?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return await response.json();
  },

  createPost: async (cnpj: string, data: { description: string; photo: string }): Promise<Post> => {
    const response = await api.post(`/api/companies/${cnpj}/posts`, data);

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return await response.json();
  },

  uploadPostImage: async (cnpj: string, file: File): Promise<{ url: string; path: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient(`/api/companies/${cnpj}/posts/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return await response.json();
  },

  deletePost: async (postId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/posts/${postId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }

    return await response.json();
  }
};
