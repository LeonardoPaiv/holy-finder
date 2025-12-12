import mongoose, { Schema } from 'mongoose';
import { Post } from '../../types';
import { EventSchema, GeoSchema, Religions } from './common';

const PostSchema = new Schema<Post>({
    cnpj: { type: String, required: true },
    type: {
        type: String,
        enum: Religions,
        required: true
    },
    photo: { type: String, required: false },
    description: { type: String, required: false },
    geo: { type: GeoSchema, required: true },
    events: [EventSchema]
}, {
    timestamps: true
});

export default mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);
