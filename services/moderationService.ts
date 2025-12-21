import Cookies from 'js-cookie';

export interface ModerationStatus {
  activeCompanies: number;
  inactiveCompanies: number;
  activeUsers: number;
  totalPosts: number;
  pendingReports: number;
}

export const ModerationService = {
  getStatus: async (): Promise<ModerationStatus | null> => {
    try {
      const token = Cookies.get('sb-access-token');
      const response = await fetch('/api/moderation/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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
