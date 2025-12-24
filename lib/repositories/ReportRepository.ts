import { BaseRepository } from './BaseRepository';
import { Report, ReportDocument } from '../models/Report';
import { ReportStatus, ReportType, PaginatedResult } from '@/types';

export class ReportRepository extends BaseRepository<ReportDocument> {
    constructor() {
        super(Report);
    }

    async countPending(): Promise<number> {
        return this.model.countDocuments({ status: ReportStatus.PENDING });
    }

    async updateStatus(id: string, status: ReportStatus): Promise<ReportDocument | null> {
        return this.model.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    }

    async findPaginated(
        filters: {
            status?: ReportStatus;
            type?: ReportType;
            cnpj?: string;
            reportId?: string;
        },
        page: number,
        limit: number
    ): Promise<PaginatedResult<ReportDocument>> {
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.cnpj) {
            query.cnpj = filters.cnpj;
        }

        if (filters.reportId) {
            query._id = filters.reportId;
        }

        // Execute queries in parallel
        const [data, total] = await Promise.all([
            this.model
                .find(query)
                .populate('cnpj', 'name')
                .populate('userId', 'fullName email')
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
