import { BaseRepository } from './BaseRepository';
import User from '../models/User';
import { User as IUser } from '../../types';
import { Document } from 'mongoose';

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
}
