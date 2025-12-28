import { BaseRepository } from './BaseRepository';
import Transaction from '../models/Transaction';
import { Transaction as ITransaction, PaginatedResult } from '../../types';
import { Document } from 'mongoose';

type TransactionDocument = ITransaction & Document;

export class TransactionRepository extends BaseRepository<TransactionDocument> {
    constructor() {
        super(Transaction);
    }

    async findByDonatorId(donatorId: string): Promise<TransactionDocument[]> {
        return this.model.find({ donatorId }).sort({ createdAt: -1 }).exec();
    }

    async findByCategory(category: 'donation' | 'bill'): Promise<TransactionDocument[]> {
        return this.model.find({ category }).sort({ createdAt: -1 }).exec();
    }

    async findPaginated(
        filters: {
            donatorId?: string;
            category?: 'donation' | 'bill';
        },
        page: number,
        limit: number
    ): Promise<PaginatedResult<TransactionDocument>> {
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (filters.donatorId) {
            query.donatorId = filters.donatorId;
        }

        if (filters.category) {
            query.category = filters.category;
        }

        // Execute queries in parallel
        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
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

    async getTotalByCategory(category: 'donation' | 'bill'): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { category } },
            { $group: { _id: null, total: { $sum: '$value' } } }
        ]);

        return result.length > 0 ? result[0].total : 0;
    }

    async getTotalByDonator(donatorId: string): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { donatorId } },
            { $group: { _id: null, total: { $sum: '$value' } } }
        ]);

        return result.length > 0 ? result[0].total : 0;
    }
}
