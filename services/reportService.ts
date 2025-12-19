import { COOKIES } from '@/lib/constants';
import { ReportType } from '@/types';
import jsCookie from 'js-cookie';

interface CreateReportDTO {
  type: ReportType;
  description: string;
  cnpj?: string;
  userId?: string;
}

export const ReportService = {
  createReport: async (data: CreateReportDTO) => {
    try {
      const token = jsCookie.get(COOKIES.ACCESS_TOKEN);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

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
