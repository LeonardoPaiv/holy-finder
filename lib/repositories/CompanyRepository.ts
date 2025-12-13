import { BaseRepository } from './BaseRepository';
import Company from '../models/Company';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';

// Need to intersect ICompany with Document to satisfy BaseRepository generic constraint
type CompanyDocument = ICompany & Document;

export class CompanyRepository extends BaseRepository<CompanyDocument> {
    constructor() {
        super(Company);
    }
    async findByRadius(lat: number, lng: number, radiusInKm: number): Promise<CompanyDocument[]> {
        return this.model.find({
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radiusInKm * 1000
                }
            }
        });
    }
}
