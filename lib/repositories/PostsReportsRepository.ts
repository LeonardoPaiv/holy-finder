import { BaseRepository } from './BaseRepository';
import { PostsReportsModel, PostsReportsDocument } from '../models/PostsReports';
import { PaginatedResult, ReportStatus } from '../../types';

interface PostsReportsFilters {
    cnpj?: string;
    postId?: string;
    postCreator?: string;
    status?: ReportStatus;
}

export class PostsReportsRepository extends BaseRepository<PostsReportsDocument> {
    constructor() {
        super(PostsReportsModel);
    }

    async findByPost(postId: string): Promise<PostsReportsDocument | null> {
        return this.model.findOne({ post: postId });
    }

    async findByPostCreator(creatorId: string): Promise<PostsReportsDocument[]> {
        return this.model.find({ postCreator: creatorId }).sort({ count: -1 });
    }

    async addReport(postId: string, postCreatorId: string, cnpj: string, reportComment: string): Promise<PostsReportsDocument | null> {
        return this.model.findOneAndUpdate(
            { post: postId },
            {
                $inc: { count: 1 },
                $push: { reports: reportComment },
                $setOnInsert: { postCreator: postCreatorId, cnpj, status: ReportStatus.PENDING }
            },
            { new: true, upsert: true }
        );
    }

    async findPaginated(
        filters: PostsReportsFilters,
        page: number,
        limit: number
    ): Promise<PaginatedResult<PostsReportsDocument>> {
        const skip = (page - 1) * limit;

        // Build query based on filters
        const query: any = {};

        // If postId is provided, ignore other filters
        if (filters.postId) {
            query.post = filters.postId;
        } else {
            if (filters.postCreator) {
                query.postCreator = filters.postCreator;
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.cnpj) {
                query.cnpj = filters.cnpj;
            }
        }

        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .populate('post', 'description photo createdAt')
                .populate('postCreator', '_id fullName email')
                .populate('cnpj', '_id name type')
                .skip(skip)
                .limit(limit)
                .sort({ count: -1, updatedAt: -1 }),
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

    async countAllByStatus(status: ReportStatus = ReportStatus.PENDING): Promise<number> {
        return this.model.countDocuments({ status });
    }

    async resolveUserReports(creatorId: string): Promise<number> {
        const result = await this.model.updateMany(
            { postCreator: creatorId, status: ReportStatus.PENDING },
            { status: ReportStatus.SOLVED }
        );
        return result.modifiedCount;
    }
}
