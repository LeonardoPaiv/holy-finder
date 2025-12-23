import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { PostsReportsRepository } from '@/lib/repositories/PostsReportsRepository';
import { ReportStatus } from '@/types';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
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
        const { status } = body;

        // 3. Validate Input
        if (!status || !Object.values(ReportStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: PENDING, SOLVED, REJECTED' },
                { status: 400 }
            );
        }

        // 4. Update PostReport Status
        const postsReportsRepository = new PostsReportsRepository();
        const postReport = await postsReportsRepository.updateStatus(params.id, status);

        if (!postReport) {
            return NextResponse.json(
                { error: 'Post report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(postReport);

    } catch (error) {
        console.error('Error updating post report status:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
