import { BaseRepository } from './BaseRepository';
import Company from '../models/Company';
import { Company as ICompany, PaginatedResult } from '../../types';
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

    async searchByName(name: string, lat: number, lng: number, limit: number = 5, type?: string, active: boolean = true): Promise<CompanyDocument[]> {
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
            ...active && { active }
        };

        if (type) {
            query.type = type;
        }

        return this.model.find(query, '_id name geo type').limit(limit);
    }

    async findInactiveCompanies(page: number, limit: number, defaultName: string): Promise<PaginatedResult<CompanyDocument>> {
        const query = {
            active: false,
            name: { $ne: defaultName }
        };

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model.find(query).skip(skip).limit(limit).sort({ updatedAt: -1 }),
            this.model.countDocuments(query)
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        };
    }

    async updateActiveStatus(cnpj: string, active: boolean): Promise<CompanyDocument | null> {
        return this.model.findByIdAndUpdate(
            cnpj,
            { active },
            { new: true }
        );
    }

    async countByStatus(): Promise<{ active: number; inactive: number }> {
        const result = await this.model.aggregate([
            {
                $group: {
                    _id: '$active',
                    count: { $sum: 1 }
                }
            }
        ]);

        const counts = { active: 0, inactive: 0 };
        result.forEach((item) => {
            if (item._id === true) {
                counts.active = item.count;
            } else {
                counts.inactive = item.count;
            }
        });

        return counts;
    }
}
