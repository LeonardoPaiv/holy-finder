import mongoose, { Schema, Document } from 'mongoose';
import { ReportStatus } from '../../types';

export interface PostsReports {
    post: string; // ref to Post
    postCreator: string; // ref to User
    cnpj: string; // ref to Company
    count: number;
    reports: string[]; // array of report IDs or descriptions
    status: ReportStatus;
}

export interface PostsReportsDocument extends Omit<Document, '_id'>, PostsReports {
    _id: string; // UUID
}

const PostsReportsSchema = new Schema<PostsReportsDocument>({
    _id: { 
        type: String, 
        default: () => crypto.randomUUID() 
    },
    post: { 
        type: String, 
        ref: 'Post',
        required: true,
        unique: true // Ensure one report document per post
    },
    postCreator: { 
        type: String, 
        ref: 'User',
        required: true 
    },
    cnpj: { 
        type: String, 
        ref: 'Company',
        required: true 
    },
    count: { 
        type: Number, 
        required: true,
        default: 0
    },
    reports: [{ 
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: Object.values(ReportStatus),
        required: true,
        default: ReportStatus.PENDING
    }
}, { 
    timestamps: true 
});

// Índices para otimização de queries
// Note: post field already has an index due to unique: true
PostsReportsSchema.index({ count: -1 }); // Para ordenar por quantidade de reports

export const PostsReportsModel = mongoose.models.PostsReports || mongoose.model<PostsReportsDocument>('PostsReports', PostsReportsSchema);
