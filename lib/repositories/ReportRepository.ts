import { BaseRepository } from './BaseRepository';
import { Report, ReportDocument } from '../models/Report';
import { ReportStatus } from '@/types';

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
}
