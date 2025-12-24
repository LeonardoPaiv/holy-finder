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
    const { errorResponse } = await validateCompanyRequest(request, cnpj, [UserType.INSTITUTION_ADMIN, UserType.INSTITUTION_OWNER]);
    if (errorResponse) return errorResponse;

    // 2. Validate Body
    if (typeof body.dedicatedMapsUrl !== 'string' && body.dedicatedMapsUrl !== undefined && body.dedicatedMapsUrl !== null) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // 3. Update Maps URL
    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: cnpj },
      { $set: { dedicatedMapsUrl: body.dedicatedMapsUrl } },
      { new: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating maps url:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
