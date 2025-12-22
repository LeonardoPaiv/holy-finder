import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { PostsReportsService } from '@/lib/services/PostsReportsService';
import { ReportStatus } from '@/types';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Verify Auth & Role
        const { errorResponse } = await verifyAuth(request, [], [UserRole.MODERATOR, UserRole.SUPER_ADMIN]);
        if (errorResponse) {
            return errorResponse;
        }

        // 2. Parse Query Parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const cnpj = searchParams.get('cnpj') || undefined;
        const status = searchParams.get('status') || ReportStatus.PENDING;
        const postId = searchParams.get('postId') || undefined;
        const postCreator = searchParams.get('postCreator') || undefined;

        // 3. Validate Parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            );
        }

        // 4. Build Filters
        const filters: any = {};
        
        if (postId) {
            // If postId is provided, ignore other filters
            filters.postId = postId;
        } else {
            if (cnpj) filters.cnpj = cnpj;
            if (postCreator) filters.postCreator = postCreator;
            if (status) filters.status = status;
        }
        
        // 5. Fetch Posts Reports
        const service = new PostsReportsService();
        const result = await service.getPostsReports(filters, page, limit);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching posts reports:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
