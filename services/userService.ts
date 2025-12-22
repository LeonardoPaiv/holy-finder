import { api } from '@/lib/apiClient';

export const UserService = {
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
