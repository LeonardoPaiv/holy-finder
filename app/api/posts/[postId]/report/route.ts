import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { PostsReportsService } from '@/lib/services/PostsReportsService';

export async function POST(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        await dbConnect();

        // 1. Parse Request Body
        const body = await request.json();
        const { comment } = body;

        // 2. Validate Input
        if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
            return NextResponse.json(
                { error: 'Comment is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        if (comment.length > 500) {
            return NextResponse.json(
                { error: 'Comment must be less than 500 characters' },
                { status: 400 }
            );
        }

        // 3. Add Report via Service
        const service = new PostsReportsService();
        const result = await service.reportPost(params.postId, comment.trim());

        return NextResponse.json(
            {
                message: 'Report submitted successfully',
                reportCount: result.count
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error reporting post:', error);

        if (error instanceof Error && error.message === 'Post not found') {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
