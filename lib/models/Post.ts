import mongoose, { Schema } from 'mongoose';
import { Post } from '../../types';
import { GeoSchema, Religions } from './common';

const PostSchema = new Schema<Post>({
    cnpj: { type: String, required: true, ref: 'Company' },
    creator: { type: String, required: true, ref: 'User' },
    type: {
        type: String,
        enum: Religions,
        required: true
    },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    geo: { type: GeoSchema, required: true }
}, {
    timestamps: true
});

export default mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);
