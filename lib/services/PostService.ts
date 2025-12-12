import { BaseService } from './BaseService';
import { PostRepository } from '../repositories/PostRepository';
import { Post as IPost } from '../../types';
import { Document } from 'mongoose';

type PostDocument = IPost & Document;

export class PostService extends BaseService<PostDocument> {
    constructor() {
        super(new PostRepository());
    }
}
