import { BaseService } from './BaseService';
import { ReportDocument, IReport } from '../models/Report';
import { ReportRepository } from '../repositories/ReportRepository';

export class ReportService extends BaseService<ReportDocument> {
    constructor() {
        super(new ReportRepository());
    }

    async createReport(data: IReport): Promise<ReportDocument> {
        return this.repository.create(data);
    }
}
