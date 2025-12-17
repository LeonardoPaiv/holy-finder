import { BaseService } from './BaseService';
import { PostRepository, PostFilters, PaginationOptions, PaginatedResult } from '../repositories/PostRepository';
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

    async getPostById(id: string): Promise<PostDocument | null> {
        return this.repository.findById(id);
    }
}
