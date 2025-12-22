import { api } from '@/lib/apiClient';

export interface ModerationStatus {
  activeCompanies: number;
  inactiveCompanies: number;
  activeUsers: number;
  totalPosts: number;
  pendingReports: number;
  postsWithReports: number;
}

export const ModerationService = {
  getStatus: async (): Promise<ModerationStatus | null> => {
    try {
      const response = await api.get('/api/moderation/status');

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching moderation status:', error);
      return null;
    }
  },
};
