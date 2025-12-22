import { BaseRepository } from './BaseRepository';
import User from '../models/User';
import { User as IUser } from '../../types';
import { Document } from 'mongoose';
import { createDiacriticRegex } from '../utils/stringUtils';

type UserDocument = IUser & Document;

export class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.model.findOne({ email }).exec();
    }

    async countActive(): Promise<number> {
        return this.model.countDocuments({ type: { $ne: 'inactive' } });
    }

    async searchUsers(query: string, limit: number = 5): Promise<UserDocument[]> {

        const regexPattern = createDiacriticRegex(query);
        const regex = new RegExp(regexPattern, 'i');

        return this.model
            .find({
                $or: [
                    { fullName: regex },
                    { email: regex }
                ]
            })
            .select('_id fullName email')
            .limit(limit)
            .sort({ fullName: 1 });
    }
}
