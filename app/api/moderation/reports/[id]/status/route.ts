import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { ReportRepository } from '@/lib/repositories/ReportRepository';
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

        // 4. Update Report Status
        const reportRepository = new ReportRepository();
        const report = await reportRepository.updateStatus(params.id, status);

        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(report);

    } catch (error) {
        console.error('Error updating report status:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
