import { BaseService } from './BaseService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company as ICompany, PaginatedResult } from '../../types';
import { Document } from 'mongoose';
import { Religions } from '../models/common';

type CompanyDocument = ICompany & Document;

export class CompanyService extends BaseService<CompanyDocument> {
    constructor() {
        super(new CompanyRepository());
    }
    async getCompaniesByRadius(lat: number, lng: number, radiusInKm: number = 5, type?: string): Promise<CompanyDocument[]> {
        return (this.repository as CompanyRepository).findByRadius(lat, lng, radiusInKm, type);
    }

    async getNearestCompanies(lat: number, lng: number, limit: number = 30, type?: string): Promise<{ companies: CompanyDocument[], center: { lat: number, lng: number } }> {
        const companies = await (this.repository as CompanyRepository).findNearest(lat, lng, limit, type);
        
        let center = { lat, lng };
        if (companies.length > 0 && companies[0].geo?.coordinates) {
            // GeoJSON coordinates are [lng, lat]
            center = {
                lat: companies[0].geo.coordinates[1],
                lng: companies[0].geo.coordinates[0]
            };
        }

        return { companies, center };
    }

    async searchCompanies(name: string, lat: number, lng: number, limit: number = 5, type?: string): Promise<CompanyDocument[]> {
        return (this.repository as CompanyRepository).searchByName(name, lat, lng, limit, type);
    }
    async getCompanyByCnpj(cnpj: string): Promise<CompanyDocument | null> {
        return this.repository.findById(cnpj);
    }

    async createDefaultCompany(cnpj: string, location?: { lat: number; lng: number } | null): Promise<{ company: CompanyDocument; isNew: boolean }> {
        const existing = await this.getCompanyByCnpj(cnpj);
        if (existing) {
            return { company: existing, isNew: false };
        }

        const defaultCompany: Partial<ICompany> = {
            _id: cnpj,
            name: "Nova Instituição",
            email: "pendente@exemplo.com",
            type: Religions.CATOLICA,
            active: false,
            geo: {
                type: "Point",
                coordinates: location ? [location.lng, location.lat] : [-47.8919, -15.7975] // User location or Brasilia
            },
            events: [],
            missas: []
        };

        const newCompany = await this.repository.create(defaultCompany as any);
        return { company: newCompany, isNew: true };
    }

    async updateLocation(cnpj: string, coordinates: [number, number]): Promise<ICompany> {
        const response = await fetch(`/api/companies/${cnpj}/location`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coordinates }),
        });

        if (!response.ok) {
            throw new Error('Failed to update location');
        }

        return response.json();
    }

    async updateMapsUrl(cnpj: string, dedicatedMapsUrl: string): Promise<ICompany> {
        const response = await fetch(`/api/companies/${cnpj}/maps-url`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dedicatedMapsUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to update maps URL');
        }

        return response.json();
    }

    async getInactiveCompanies(page: number = 1, limit: number = 10): Promise<PaginatedResult<CompanyDocument>> {
        const DEFAULT_NAME = "Nova Instituição";
        return (this.repository as CompanyRepository).findInactiveCompanies(page, limit, DEFAULT_NAME);
    }

    async toggleCompanyActive(cnpj: string, active: boolean): Promise<CompanyDocument | null> {
        return (this.repository as CompanyRepository).updateActiveStatus(cnpj, active);
    }
}
