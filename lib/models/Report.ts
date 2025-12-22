import mongoose, { Schema, Document } from 'mongoose';
import { ReportType, ReportStatus } from '../../types';

export interface IReport {
    type: ReportType;
    description: string;
    cnpj?: string;
    userId?: string;
    status: ReportStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ReportDocument extends Omit<Document, '_id'>, IReport {
    _id: string; // UUID
}

const ReportSchema = new Schema<ReportDocument>({
    _id: { 
        type: String, 
        default: () => crypto.randomUUID() 
    },
    type: {
        type: String,
        enum: Object.values(ReportType),
        required: true
    },
    description: { type: String, required: true },
    cnpj: { type: String, ref: 'Company' },
    userId: { type: String, ref: 'User' },
    status: {
        type: String,
        enum: Object.values(ReportStatus),
        required: true,
        default: ReportStatus.PENDING
    }
}, {
    timestamps: true
});

export const Report = mongoose.models.Report || mongoose.model<ReportDocument>('Report', ReportSchema);
