import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { PostRepository } from '@/lib/repositories/PostRepository';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        await dbConnect();

        // 1. Verify Auth & Role
        const { errorResponse } = await verifyAuth(request, [], [UserRole.MODERATOR, UserRole.SUPER_ADMIN]);
        if (errorResponse) {
            return errorResponse;
        }

        // 2. Parse Request Body
        const body = await request.json();
        const { suspended } = body;

        // 3. Validate Input
        if (typeof suspended !== 'boolean') {
            return NextResponse.json(
                { error: 'Suspended must be a boolean' },
                { status: 400 }
            );
        }

        // 4. Update Post Suspended Status
        const postRepository = new PostRepository();
        const post = await postRepository.updateSuspendedStatus(params.postId, suspended);

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);

    } catch (error) {
        console.error('Error updating post suspended status:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
