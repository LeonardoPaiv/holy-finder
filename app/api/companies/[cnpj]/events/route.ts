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
    const { errorResponse } = await validateCompanyRequest(request, cnpj, [UserType.INSTITUTION_ADMIN, UserType.COMUM, UserType.INSTITUTION_OWNER]);
    if (errorResponse) return errorResponse;

    // 3. Update Events
    if (!Array.isArray(body.events)) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: cnpj },
      { $set: { events: body.events } },
      { new: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
