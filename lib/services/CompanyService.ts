import { BaseService } from './BaseService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';

type CompanyDocument = ICompany & Document;

export class CompanyService extends BaseService<CompanyDocument> {
    constructor() {
        super(new CompanyRepository());
    }
}
