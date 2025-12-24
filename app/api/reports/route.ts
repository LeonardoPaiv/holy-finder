import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/lib/services/ReportService';
import { ReportType, ReportStatus } from '@/types';
import { verifyAuth } from '@/lib/apiUtils';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { type, description, cnpj, userId } = body;

        // 1. Validate Type
        if (!Object.values(ReportType).includes(type)) {
            return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        // 2. Validate Description (Required for all)
        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        // 3. Auth & Specific Validations
        if (type === ReportType.INSTITUTION_INTERN_REPORT) {
            // Auth Required
            const { errorResponse } = await verifyAuth(request, [], [], true);
            if (errorResponse) {
                return errorResponse;
            }

            // CNPJ Required
            if (!cnpj) {
                return NextResponse.json({ error: 'CNPJ is required for intern reports' }, { status: 400 });
            }

            // UserId Required
            if (!userId) {
                return NextResponse.json({ error: 'UserId is required for intern reports' }, { status: 400 });
            }
        } else if (type === ReportType.INSTITUTION_PUBLIC_REPORT) {
            // Public, but CNPJ Required
            if (!cnpj) {
                return NextResponse.json({ error: 'CNPJ is required for public institution reports' }, { status: 400 });
            }
        }
        // APP_BUG is public and only needs description (already validated)

        // 4. Create Report
        const service = new ReportService();
        const report = await service.createReport({
            type,
            description,
            cnpj,
            userId,
            status: ReportStatus.PENDING
        });

        return NextResponse.json(report, { status: 201 });

    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
