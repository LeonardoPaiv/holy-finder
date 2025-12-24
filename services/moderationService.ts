import { api } from '@/lib/apiClient';
import { ReportStatus, ReportType, PaginatedResult } from '@/types';

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

  getReports: async (
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: ReportType;
      cnpj?: string;
      reportId?: string;
      status?: ReportStatus;
    }
  ): Promise<PaginatedResult<any> | null> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.type) params.append('type', filters.type);
      if (filters?.cnpj) params.append('cnpj', filters.cnpj);
      if (filters?.reportId) params.append('reportId', filters.reportId);
      if (filters?.status) params.append('status', filters.status);

      const response = await api.get(`/api/moderation/reports?${params.toString()}`);

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return null;
    }
  },

  updatePostSuspendedStatus: async (postId: string, suspended: boolean): Promise<any> => {
    const response = await api.patch(`/api/moderation/posts/${postId}/suspended`, {
      suspended
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post suspended status');
    }
    
    return await response.json();
  },

  updatePostReportStatus: async (postReportId: string, status: string): Promise<any> => {
    const response = await api.patch(`/api/moderation/posts-reports/${postReportId}/status`, {
      status
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post report status');
    }
    
    return await response.json();
  },

  updateReportStatus: async (reportId: string, status: string): Promise<any> => {
    const response = await api.patch(`/api/moderation/reports/${reportId}/status`, {
      status
    });
    
    if (!response.ok) {
      throw new Error('Failed to update report status');
    }
    
    return await response.json();
  },

  revertToPending: async (postId: string, postReportId: string): Promise<void> => {
    // Execute both operations in parallel
    await Promise.all([
      ModerationService.updatePostSuspendedStatus(postId, false),
      ModerationService.updatePostReportStatus(postReportId, ReportStatus.PENDING)
    ]);
  },
};
