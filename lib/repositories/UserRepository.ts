import { BaseRepository } from './BaseRepository';
import User from '../models/User';
import { User as IUser, PaginatedResult } from '../../types';
import { Document } from 'mongoose';
import { createDiacriticRegex } from '../utils/stringUtils';
import { UserType, UserRole } from '../models/common';

type UserDocument = IUser & Document;

export class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.model.findOne({ email }).exec();
    }

    async countActive(): Promise<number> {
        return this.model.countDocuments({ type: { $ne: 'inactive' } });
    }

    async updateUserStatus(
        email: string,
        type: string,
        role: string
    ): Promise<UserDocument | null> {
        return this.model.findOneAndUpdate(
            { email },
            { type, role },
            { new: true }
        );
    }

    async searchUsers(query: string, limit: number = 5): Promise<UserDocument[]> {

        const regexPattern = createDiacriticRegex(query);
        const regex = new RegExp(regexPattern, 'i');

        return this.model
            .find({
                $or: [
                    { fullName: regex },
                    { email: regex }
                ]
            })
            .select('_id fullName email')
            .limit(limit)
            .sort({ fullName: 1 });
    }

    async findPaginated(
        filters: {
            type?: UserType;
            role?: UserRole;
            cnpj?: string;
            userId?: string;
        },
        page: number,
        limit: number
    ): Promise<PaginatedResult<UserDocument>> {
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.role) {
            query.role = filters.role;
        }

        if (filters.cnpj) {
            query.institution = filters.cnpj;
        }

        if (filters.userId) {
            query._id = filters.userId;
        }

        // Execute queries in parallel
        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .populate('institution', 'name')
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
}
