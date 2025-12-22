import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { CompanyRepository } from '@/lib/repositories/CompanyRepository';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { PostRepository } from '@/lib/repositories/PostRepository';
import { ReportRepository } from '@/lib/repositories/ReportRepository';
import { PostsReportsRepository } from '@/lib/repositories/PostsReportsRepository';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Verify Auth & Role
        const { errorResponse } = await verifyAuth(request, [], [UserRole.MODERATOR, UserRole.SUPER_ADMIN]);
        if (errorResponse) {
            return errorResponse;
        }

        // 2. Fetch all counts in parallel using Promise.all
        const [companyCounts, activeUsers, totalPosts, pendingReports, postsWithReports] = await Promise.all([
            new CompanyRepository().countByStatus(),
            new UserRepository().countActive(),
            new PostRepository().countAll(),
            new ReportRepository().countPending(),
            new PostsReportsRepository().countAllByStatus(),
        ]);

        // 3. Return status
        return NextResponse.json({
            activeCompanies: companyCounts.active,
            inactiveCompanies: companyCounts.inactive,
            activeUsers,
            totalPosts,
            pendingReports,
            postsWithReports,
        });

    } catch (error) {
        console.error('Error fetching moderation status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
