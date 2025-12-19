import { BaseRepository } from './BaseRepository';
import Company from '../models/Company';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';
import { createDiacriticRegex } from '../utils/stringUtils';

// Need to intersect ICompany with Document to satisfy BaseRepository generic constraint
type CompanyDocument = ICompany & Document;

export class CompanyRepository extends BaseRepository<CompanyDocument> {
    constructor() {
        super(Company);
    }
    async findByRadius(lat: number, lng: number, radiusInKm: number, type?: string): Promise<CompanyDocument[]> {
        const query: any = {
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radiusInKm * 1000
                }
            },
            active: true
        };

        if (type) {
            query.type = type;
        }

        return this.model.find(query);
    }

    async findNearest(lat: number, lng: number, limit: number, type?: string): Promise<CompanyDocument[]> {
        const query: any = {
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    }
                }
            },
            active: true
        };

        if (type) {
            query.type = type;
        }

        return this.model.find(query).limit(limit);
    }

    async searchByName(name: string, lat: number, lng: number, limit: number = 5, type?: string): Promise<CompanyDocument[]> {
        const query: any = {
            name: { $regex: createDiacriticRegex(name) },
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    }
                }
            },
            active: true
        };

        if (type) {
            query.type = type;
        }

        return this.model.find(query, '_id name geo type').limit(limit);
    }
}
