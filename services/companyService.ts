import { Company } from '../types';
import Cookies from 'js-cookie';

export const CompanyService = {
    getCompanies: async (lat: number, lng: number, radius: number = 5, limit: number = 30): Promise<Company[]> => {
        try {
            const response = await fetch(`/api/companies/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching companies:', error);
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
        const response = await fetch(`/api/companies/${cnpj}/basic-info`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update basic info');
        return await response.json();
    },

    updateMissas: async (cnpj: string, missas: any[]): Promise<Company> => {
        const response = await fetch(`/api/companies/${cnpj}/missas`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
            },
            body: JSON.stringify({ missas })
        });
        if (!response.ok) throw new Error('Failed to update missas');
        return await response.json();
    },

    updateEvents: async (cnpj: string, events: any[]): Promise<Company> => {
        const response = await fetch(`/api/companies/${cnpj}/events`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
            },
            body: JSON.stringify({ events })
        });
        if (!response.ok) throw new Error('Failed to update events');
        return await response.json();
    },

    updateLocation: async (cnpj: string, coordinates: [number, number]): Promise<Company> => {
        const response = await fetch(`/api/companies/${cnpj}/location`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
            },
            body: JSON.stringify({ coordinates })
        });
        if (!response.ok) throw new Error('Failed to update location');
        return await response.json();
    },

    updateMapsUrl: async (cnpj: string, dedicatedMapsUrl: string): Promise<Company> => {
        const response = await fetch(`/api/companies/${cnpj}/maps-url`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('sb-access-token')}`
            },
            body: JSON.stringify({ dedicatedMapsUrl })
        });
        if (!response.ok) throw new Error('Failed to update maps URL');
        return await response.json();
    },
};
