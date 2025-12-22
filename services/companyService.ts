import { Company, PaginatedResult } from '../types';
import { api } from '@/lib/apiClient';

export const CompanyService = {
    getCompanies: async (lat: number, lng: number, radius: number = 5, limit: number = 30, type?: string): Promise<Company[]> => {
        try {
            let url = `/api/companies/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`;
            if (type) {
                url += `&type=${encodeURIComponent(type)}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    },

    getNearestCompanies: async (lat: number, lng: number, type?: string, limit: number = 30): Promise<{ companies: Company[], center: { lat: number, lng: number } }> => {
        try {
            let url = `/api/companies/nearest?lat=${lat}&lng=${lng}&limit=${limit}`;
            if (type) {
                url += `&type=${encodeURIComponent(type)}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch nearest companies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching nearest companies:', error);
            return { companies: [], center: { lat, lng } };
        }
    },

    searchCompanies: async (q: string, lat: number, lng: number, limit: number = 5, type?: string, active: boolean = true): Promise<Company[]> => {
        try {
            let url = `/api/companies/search?q=${encodeURIComponent(q)}&lat=${lat}&lng=${lng}&limit=${limit}&active=${active}`;
            if (type) {
                url += `&type=${encodeURIComponent(type)}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to search companies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching companies:', error);
            return [];
        }
    },

    getCompanyByCnpj: async (cnpj: string): Promise<Company | null> => {
        try {
            const response = await fetch(`/api/companies/${cnpj}`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching company by CNPJ:', error);
            return null;
        }
    },

    updateBasicInfo: async (cnpj: string, data: Partial<Company>): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/basic-info`, data);
        if (!response.ok) throw new Error('Failed to update basic info');
        return await response.json();
    },

    updateMissas: async (cnpj: string, missas: any[]): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/missas`, { missas });
        if (!response.ok) throw new Error('Failed to update missas');
        return await response.json();
    },

    updateEvents: async (cnpj: string, events: any[]): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/events`, { events });
        if (!response.ok) throw new Error('Failed to update events');
        return await response.json();
    },

    updateLocation: async (cnpj: string, coordinates: [number, number]): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/location`, { coordinates });
        if (!response.ok) throw new Error('Failed to update location');
        return await response.json();
    },

    updateMapsUrl: async (cnpj: string, dedicatedMapsUrl: string): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/maps-url`, { dedicatedMapsUrl });
        if (!response.ok) throw new Error('Failed to update maps URL');
        return await response.json();
    },

    updateCoverImage: async (cnpj: string, photoUrl: string): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/cover-image`, { photoUrl });
        if (!response.ok) throw new Error('Failed to update cover image');
        return await response.json();
    },

    deleteCoverImage: async (cnpj: string): Promise<Company> => {
        const response = await api.patch(`/api/companies/${cnpj}/cover-image`, { photoUrl: null });
        if (!response.ok) throw new Error('Failed to delete cover image');
        return await response.json();
    },

    getCompanyUsers: async (cnpj: string): Promise<any[]> => {
        const response = await api.get(`/api/companies/${cnpj}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },

    updateCompanyUserRole: async (cnpj: string, userId: string, type: string): Promise<any> => {
        const response = await api.patch(`/api/companies/${cnpj}/users`, { _id: userId, type });
        if (!response.ok) throw new Error('Failed to update user role');
        return await response.json();
    },

     getInactiveCompanies: async (page: number = 1, limit: number = 10): Promise<PaginatedResult<Company>> => {
    try {
      const response = await api.get(`/api/moderation/companies?page=${page}&limit=${limit}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch inactive companies');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inactive companies:', error);
      throw error;
    }
  },

  toggleCompanyActive: async (cnpj: string, active: boolean): Promise<Company> => {
    try {
      const response = await api.patch(`/api/moderation/companies/${cnpj}`, { active });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle company status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling company status:', error);
      throw error;
    }
  },
};
