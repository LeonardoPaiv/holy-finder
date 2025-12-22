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

export interface FeedFilters {
    lat?: number;
    lng?: number;
    radius?: number; // in km
    religion?: string;
    cnpj?: string;
    postId?: string;
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

    async findNearby(
        filters: FeedFilters,
        options: PaginationOptions
    ): Promise<PaginatedResult<PostDocument>> {
        const skip = (options.page - 1) * options.limit;

        // For geospatial search, we MUST use aggregation pipeline ($geoNear must be first stage)
        if (filters.lat !== undefined && filters.lng !== undefined) {
            const radiusInMeters = (filters.radius || 5) * 1000;
            
            const pipeline: any[] = [
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [filters.lng, filters.lat]
                        },
                        distanceField: 'distance',
                        maxDistance: radiusInMeters,
                        spherical: true,
                        query: filters.religion ? { type: filters.religion } : {}
                    }
                },
                { $sort: { createdAt: -1 } }
            ];

            // Get total count
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await this.model.aggregate(countPipeline);
            const total = countResult.length > 0 ? countResult[0].total : 0;

            // Get paginated data with company lookup
            const dataPipeline = [
                ...pipeline,
                { $skip: skip },
                { $limit: options.limit },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'cnpj',
                        foreignField: '_id',
                        as: 'cnpj'
                    }
                },
                { $unwind: { path: '$cnpj', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        photo: 1,
                        type: 1,
                        geo: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        distance: 1,
                        'cnpj._id': 1,
                        'cnpj.name': 1
                    }
                }
            ];

            const data = await this.model.aggregate(dataPipeline);

            return {
                data: data as any,
                pagination: {
                    page: options.page,
                    limit: options.limit,
                    total,
                    totalPages: Math.ceil(total / options.limit),
                    hasMore: options.page * options.limit < total
                }
            };
        }

        // For CNPJ filter, use regular query with populate (simpler and works fine)
        const query: any = {};
        if (filters.cnpj) {
            query.cnpj = filters.cnpj;
        }

        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(options.limit)
                .populate('cnpj', '_id name')
                .select('-__v')
                .lean(),
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

    async findById(postId: string): Promise<PostDocument & { cnpj: { _id: string; name: string } } | null> {
        const post = await this.model
            .findById(postId)
            .select('-__v')
            .populate('cnpj', '_id name')
            .lean();

        if (!post) return null;

        return post as unknown as PostDocument & { cnpj: { _id: string; name: string } };
    }

    async countAll(): Promise<number> {
        return this.model.countDocuments();
    }
}
