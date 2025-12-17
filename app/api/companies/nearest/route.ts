import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const limit = searchParams.get('limit');
    const type = searchParams.get('type');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const service = new CompanyService();
    try {
        const result = await service.getNearestCompanies(
            parseFloat(lat), 
            parseFloat(lng), 
            limit ? parseInt(limit) : 30,
            type || undefined
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching nearest companies:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
