import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const type = searchParams.get('type') || undefined;
    const active = searchParams.get('active');
    const isActive = !active || active === 'true';

    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Location parameters "lat" and "lng" are required' }, { status: 400 });
    }

    try {
        const service = new CompanyService();
        const companies = await service.searchCompanies(q, lat, lng, limit, type, isActive);
        return NextResponse.json(companies);
    } catch (error) {
        console.error('Error searching companies:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
