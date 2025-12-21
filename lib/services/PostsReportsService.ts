import { BaseService } from './BaseService';
import { PostsReportsRepository } from '../repositories/PostsReportsRepository';
import { PostsReportsDocument } from '../models/PostsReports';
import { PostRepository } from '../repositories/PostRepository';

export class PostsReportsService extends BaseService<PostsReportsDocument> {
    private postRepository: PostRepository;

    constructor() {
        super(new PostsReportsRepository());
        this.postRepository = new PostRepository();
    }

    async reportPost(postId: string, reportComment: string): Promise<PostsReportsDocument> {
        // 1. Verificar se o post existe e obter o criador
        const post = await this.postRepository.findById(postId);
        
        if (!post) {
            throw new Error('Post not found');
        }

        // 2. Adicionar report ao PostsReports (cria se não existir)
        const result = await (this.repository as PostsReportsRepository).addReport(
            postId,
            post.creator,
            reportComment
        );

        if (!result) {
            throw new Error('Failed to add report');
        }

        return result;
    }

    async getPostReports(postId: string): Promise<PostsReportsDocument | null> {
        return (this.repository as PostsReportsRepository).findByPost(postId);
    }

    async getCreatorReports(creatorId: string): Promise<PostsReportsDocument[]> {
        return (this.repository as PostsReportsRepository).findByPostCreator(creatorId);
    }
}
