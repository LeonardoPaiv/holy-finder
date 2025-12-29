import { BaseService } from './BaseService';
import { PostRepository, PostFilters, FeedFilters, PaginationOptions, PaginatedResult } from '../repositories/PostRepository';
import { Post as IPost, Geo, CompanyType } from '../../types';
import { Document } from 'mongoose';

type PostDocument = IPost & Document;

export interface CreatePostData {
    cnpj: string;
    creator: string;
    type: CompanyType;
    description: string;
    photo: string;
    geo: Geo;
    active: boolean;
}

export class PostService extends BaseService<PostDocument> {
    constructor() {
        super(new PostRepository());
    }

    async createPost(data: CreatePostData): Promise<PostDocument> {
        return this.repository.create(data as any);
    }

    async getPostsPaginated(
        filters: PostFilters,
        options: PaginationOptions
    ): Promise<PaginatedResult<PostDocument>> {
        return (this.repository as PostRepository).findPaginated(filters, options);
    }

    async getFeedPosts(
        filters: FeedFilters,
        options: PaginationOptions
    ): Promise<PaginatedResult<PostDocument>> {
        return (this.repository as PostRepository).findNearby(filters, options);
    }

    async getPostById(id: string): Promise<PostDocument & { cnpj: { _id: string; name: string } } | null> {
        return (this.repository as PostRepository).findById(id);
    }

    async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
        try {
            // First, get the post to retrieve the photo URL
            const post = await this.repository.findById(postId);
            
            if (!post) {
                return { success: false, error: 'Post not found' };
            }

            // Delete from database
            const deletedPost = await (this.repository as PostRepository).deletePost(postId);
            
            if (!deletedPost) {
                return { success: false, error: 'Failed to delete post from database' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error in PostService.deletePost:', error);
            return { success: false, error: 'Internal server error' };
        }
    }
}
