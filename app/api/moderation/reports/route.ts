import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { ReportStatus, ReportType } from '@/types';
import { ReportRepository } from '@/lib/repositories/ReportRepository';
import { UserRole } from '@/lib/models/common';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication - only moderators and super admins
    const { errorResponse } = await verifyAuth(
      request,
      [],
      [UserRole.MODERATOR, UserRole.SUPER_ADMIN]
    );

    if (errorResponse) {
      return errorResponse;
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as ReportStatus | null;
    const type = searchParams.get('type') as ReportType | null;
    const cnpj = searchParams.get('cnpj');
    const reportId = searchParams.get('reportId');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !Object.values(ReportStatus).includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${Object.values(ReportStatus).join(', ')}` },
        { status: 400 }
      );
    }

    // Validate type if provided
    if (type && !Object.values(ReportType).includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${Object.values(ReportType).join(', ')}` },
        { status: 400 }
      );
    }

    // Build filters
    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (cnpj) filters.cnpj = cnpj;
    if (reportId) filters.reportId = reportId;

    // Fetch paginated reports
    const repository = new ReportRepository();
    const result = await repository.findPaginated(filters, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
