import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { cnpj: string } }
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
        const { active } = body;

        // 3. Validate Input
        if (typeof active !== 'boolean') {
            return NextResponse.json({ error: 'Invalid active value. Must be boolean.' }, { status: 400 });
        }

        // 4. Update Company
        const service = new CompanyService();
        const updatedCompany = await service.toggleCompanyActive(params.cnpj, active);

        if (!updatedCompany) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(updatedCompany);

    } catch (error) {
        console.error('Error toggling company active status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
