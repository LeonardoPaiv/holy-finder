import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CompanyModel from '@/lib/models/Company';
import { validateCompanyRequest } from '@/lib/apiUtils';
import { UserType } from '@/lib/models/common';

export async function PATCH(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;
    const body = await request.json();

    // 1. Verify Authentication & Permissions
    const { errorResponse } = await validateCompanyRequest(request, cnpj, [UserType.INSTITUTION_ADMIN]);
    if (errorResponse) return errorResponse;

    // 2. Validate Body
    if (!body.coordinates || !Array.isArray(body.coordinates) || body.coordinates.length !== 2) {
        return NextResponse.json({ error: 'Invalid coordinates format. Expected [longitude, latitude]' }, { status: 400 });
    }

    const [longitude, latitude] = body.coordinates;

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        return NextResponse.json({ error: 'Coordinates must be numbers' }, { status: 400 });
    }

    // 3. Update Location
    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: cnpj },
      { 
          $set: { 
              geo: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
              }
          } 
      },
      { new: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
