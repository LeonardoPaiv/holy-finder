import { COOKIES } from '@/lib/constants';
import { Post } from '../types';
import Cookies from 'js-cookie';

interface PostsResponse {
  posts: (Post & {
    creator?: {
      _id: string;
      fullName: string;
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

    const response = await fetch(`/api/companies/${cnpj}/posts?${params}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return await response.json();
  },

  createPost: async (cnpj: string, data: { description: string; photo: string }): Promise<Post> => {
    const token = Cookies.get(COOKIES.ACCESS_TOKEN)
    const response = await fetch(`/api/companies/${cnpj}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return await response.json();
  },

  uploadPostImage: async (cnpj: string, file: File): Promise<{ url: string; path: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/companies/${cnpj}/posts/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return await response.json();
  }
};
