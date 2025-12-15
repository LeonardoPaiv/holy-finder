import { BaseService } from './BaseService';
import { UserRepository } from '../repositories/UserRepository';
import { User as IUser } from '../../types';
import { Document } from 'mongoose';

type UserDocument = IUser & Document;

export class UserService extends BaseService<UserDocument> {
    constructor() {
        super(new UserRepository());
    }

    async getUserByEmail(email: string): Promise<UserDocument | null> {
        return (this.repository as UserRepository).findByEmail(email);
    }

    async createUser(data: Partial<IUser>): Promise<UserDocument> {
        return this.repository.create(data as any);
    }
}
