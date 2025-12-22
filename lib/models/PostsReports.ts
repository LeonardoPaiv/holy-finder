import mongoose, { Schema, Document } from 'mongoose';

export interface PostsReports {
    post: string; // ref to Post
    postCreator: string; // ref to User
    count: number;
    reports: string[]; // array of report IDs or descriptions
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
    count: { 
        type: Number, 
        required: true,
        default: 0
    },
    reports: [{ 
        type: String,
        required: true
    }]
}, { 
    timestamps: true 
});

// Índices para otimização de queries
PostsReportsSchema.index({ post: 1 });
PostsReportsSchema.index({ postCreator: 1 });
PostsReportsSchema.index({ count: -1 }); // Para ordenar por quantidade de reports

export const PostsReportsModel = mongoose.models.PostsReports || mongoose.model<PostsReportsDocument>('PostsReports', PostsReportsSchema);
