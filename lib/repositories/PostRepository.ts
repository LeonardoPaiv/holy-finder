import { BaseRepository } from './BaseRepository';
import PostModel from '../models/Post';
import { Post as IPost } from '../../types';
import { Document } from 'mongoose';

type PostDocument = IPost & Document;

export interface PostFilters {
    cnpj: string;
    postId?: string;
    creatorId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export class PostRepository extends BaseRepository<PostDocument> {
    constructor() {
        super(PostModel);
    }

    async findPaginated(
        filters: PostFilters,
        options: PaginationOptions
    ): Promise<PaginatedResult<PostDocument>> {
        const query: any = { cnpj: filters.cnpj };

        if (filters.postId) {
            query._id = filters.postId;
        }

        if (filters.creatorId) {
            query.creator = filters.creatorId;
        }

        if (filters.dateFrom || filters.dateTo) {
            query.createdAt = {};
            if (filters.dateFrom) {
                query.createdAt.$gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                query.createdAt.$lte = filters.dateTo;
            }
        }

        const skip = (options.page - 1) * options.limit;
        
        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(options.limit)
                .populate('creator', '_id fullName'),
            this.model.countDocuments(query)
        ]);

        return {
            data,
            pagination: {
                page: options.page,
                limit: options.limit,
                total,
                totalPages: Math.ceil(total / options.limit),
                hasMore: options.page * options.limit < total
            }
        };
    }
}
