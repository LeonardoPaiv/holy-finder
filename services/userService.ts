import { api } from '@/lib/apiClient';
import { User } from '@/types';

export const UserService = {
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get(`/api/users/${email}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }
    
    return await response.json();
  },

  confirmUser: async (data: {
    email: string;
    fullName: string;
    institution: string;
    location?: { lat: number; lng: number };
  }): Promise<any> => {
    const response = await api.post('/api/users/confirm', data);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user profile');
    }
    
    return await response.json();
  },

  banUser: async (email: string): Promise<{
    user: any;
    postsSuspended: number;
    reportsResolved: number;
  }> => {
    const response = await api.post(`/api/users/${email}/ban`, {});
    
    if (!response.ok) {
      throw new Error('Failed to ban user');
    }
    
    return await response.json();
  },
};

