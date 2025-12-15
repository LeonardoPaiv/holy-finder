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
}
