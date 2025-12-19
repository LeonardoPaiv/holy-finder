import { BaseRepository } from './BaseRepository';
import { Report, ReportDocument } from '../models/Report';

export class ReportRepository extends BaseRepository<ReportDocument> {
    constructor() {
        super(Report);
    }
}
