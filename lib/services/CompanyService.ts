import { BaseService } from './BaseService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';

type CompanyDocument = ICompany & Document;

export class CompanyService extends BaseService<CompanyDocument> {
    constructor() {
        super(new CompanyRepository());
    }
    async getCompaniesByRadius(lat: number, lng: number, radiusInKm: number = 5): Promise<CompanyDocument[]> {
        return (this.repository as CompanyRepository).findByRadius(lat, lng, radiusInKm);
    }
}
