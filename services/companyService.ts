import { Company } from '../types';

export const CompanyService = {
    getCompanies: async (lat: number, lng: number, radius: number = 5): Promise<Company[]> => {
        try {
            const response = await fetch(`/api/companies/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    },

    getCompanyById: async (id: string): Promise<Company | undefined> => {
        // TODO: Implement get by ID API endpoint if needed
        return undefined;
    },

    updateCompany: async (updatedCompany: Partial<Company> & { _id?: string }): Promise<Company> => {
        // TODO: Implement update API endpoint
        console.log('Simulating update for:', updatedCompany);
        return updatedCompany as Company;
    }
};
