import { BaseRepository } from './BaseRepository';
import { PostsReportsModel, PostsReportsDocument } from '../models/PostsReports';

export class PostsReportsRepository extends BaseRepository<PostsReportsDocument> {
    constructor() {
        super(PostsReportsModel);
    }

    async findByPost(postId: string): Promise<PostsReportsDocument | null> {
        return this.model.findOne({ post: postId });
    }

    async findByPostCreator(creatorId: string): Promise<PostsReportsDocument[]> {
        return this.model.find({ postCreator: creatorId }).sort({ count: -1 });
    }

    async addReport(postId: string, postCreatorId: string, cnpj: string, reportComment: string): Promise<PostsReportsDocument | null> {
        return this.model.findOneAndUpdate(
            { post: postId },
            {
                $inc: { count: 1 },
                $push: { reports: reportComment },
                $setOnInsert: { postCreator: postCreatorId, cnpj }
            },
            { new: true, upsert: true }
        );
    }

    async countAll(): Promise<number> {
        return this.model.countDocuments();
    }
}
