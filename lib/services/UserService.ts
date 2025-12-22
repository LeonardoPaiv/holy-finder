import { BaseService } from './BaseService';
import { UserRepository } from '../repositories/UserRepository';
import { PostRepository } from '../repositories/PostRepository';
import { PostsReportsRepository } from '../repositories/PostsReportsRepository';
import { User as IUser } from '../../types';
import { Document } from 'mongoose';
import { UserType, UserRole } from '../models/common';

type UserDocument = IUser & Document;

export class UserService extends BaseService<UserDocument> {
    private postRepository: PostRepository;
    private postsReportsRepository: PostsReportsRepository;

    constructor() {
        super(new UserRepository());
        this.postRepository = new PostRepository();
        this.postsReportsRepository = new PostsReportsRepository();
    }

    async getUserByEmail(email: string): Promise<UserDocument | null> {
        return (this.repository as UserRepository).findByEmail(email);
    }

    async createUser(data: Partial<IUser>): Promise<UserDocument> {
        return this.repository.create(data as any);
    }

    async banUser(email: string): Promise<{
        user: UserDocument;
        postsSuspended: number;
        reportsResolved: number;
    }> {
        // 1. Update user status in MongoDB
        const user = await (this.repository as UserRepository).updateUserStatus(
            email,
            UserType.INACTIVE,
            UserRole.BANNED
        );

        if (!user) {
            throw new Error('User not found in database');
        }

        // 2. Suspend all user posts
        const postsSuspended = await this.postRepository.suspendUserPosts(user._id);

        // 3. Resolve all pending user reports
        const reportsResolved = await this.postsReportsRepository.resolveUserReports(user._id);

        return {
            user,
            postsSuspended,
            reportsResolved
        };
    }
}
