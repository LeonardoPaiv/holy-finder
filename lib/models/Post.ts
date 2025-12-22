import mongoose, { Schema } from 'mongoose';
import { Post } from '../../types';
import { GeoSchema, Religions } from './common';

const PostSchema = new Schema<Post>({
    _id: { 
        type: String, 
        default: () => crypto.randomUUID() 
    },
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

PostSchema.index({ geo: '2dsphere' });

const PostModel = mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);

const syncIndexes = () => {
    PostModel.syncIndexes().then(() => {
        console.log('Post indexes synced');
    }).catch((err: any) => {
        console.error('Post index sync failed', err);
    });
};

if (mongoose.connection.readyState === 1) {
    syncIndexes();
} else {
    mongoose.connection.once('connected', syncIndexes);
}

export default PostModel;
