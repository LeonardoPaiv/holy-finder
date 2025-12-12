import { BaseRepository } from './BaseRepository';
import Post from '../models/Post';
import { Post as IPost } from '../../types';
import { Document } from 'mongoose';

type PostDocument = IPost & Document;

export class PostRepository extends BaseRepository<PostDocument> {
    constructor() {
        super(Post);
    }
}
