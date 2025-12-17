import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const type = searchParams.get('type');

    const service = new CompanyService();
    try {
        const companies = await service.getCompaniesByRadius(
            parseFloat(lat), 
            parseFloat(lng), 
            radius ? parseFloat(radius) : 5,
            type || undefined
        );
        return NextResponse.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
