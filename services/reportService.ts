import { ReportType } from '@/types';
import { api } from '@/lib/apiClient';

interface CreateReportDTO {
  type: ReportType;
  description: string;
  cnpj?: string;
  userId?: string;
}

export const ReportService = {
  createReport: async (data: CreateReportDTO) => {
    try {
      const response = await api.post('/api/reports', data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
};
