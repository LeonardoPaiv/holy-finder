import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';

export async function GET(
    request: NextRequest,
    { params }: { params: { cnpj: string } }
) {
    await dbConnect();
    const cnpj = params.cnpj;

    if (!cnpj) {
        return NextResponse.json({ error: 'CNPJ is required' }, { status: 400 });
    }

    const service = new CompanyService();
    try {
        const company = await service.getCompanyByCnpj(cnpj);
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
