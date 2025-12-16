import { BaseService } from './BaseService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';
import { Religions } from '../models/common';

type CompanyDocument = ICompany & Document;

export class CompanyService extends BaseService<CompanyDocument> {
    constructor() {
        super(new CompanyRepository());
    }
    async getCompaniesByRadius(lat: number, lng: number, radiusInKm: number = 5): Promise<CompanyDocument[]> {
        return (this.repository as CompanyRepository).findByRadius(lat, lng, radiusInKm);
    }
    async getCompanyByCnpj(cnpj: string): Promise<CompanyDocument | null> {
        return this.repository.findById(cnpj);
    }

    async createDefaultCompany(cnpj: string): Promise<CompanyDocument> {
        const existing = await this.getCompanyByCnpj(cnpj);
        if (existing) {
            return existing;
        }

        const defaultCompany: Partial<ICompany> = {
            _id: cnpj,
            name: "Nova Instituição",
            email: "pendente@exemplo.com",
            type: Religions.CATOLICA,
            active: false,
            geo: {
                type: "Point",
                coordinates: [-47.8919, -15.7975] // Brasilia
            },
            events: [],
            missas: []
        };

        return this.repository.create(defaultCompany as any);
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
}
