import mongoose, { Schema } from 'mongoose';
import { User } from '../../types';
import { UserType } from './common';

const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    institution: { type: String, required: true, ref: 'Company' },
    type: {
        type: String,
        enum: Object.values(UserType),
        required: true,
        default: UserType.INACTIVE
    }
}, {
    timestamps: true
});

const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
