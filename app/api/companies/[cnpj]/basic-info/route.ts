import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CompanyModel from '@/lib/models/Company';
import PostModel from '@/lib/models/Post';
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

    // 2. Check if type is being changed
    const typeChanged = body.type !== undefined;
    const oldCompany = typeChanged ? await CompanyModel.findOne({ _id: cnpj }) : null;

    // 3. Update Basic Info
    const allowedFields = ['name', 'email', 'tel', 'address', 'type'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: cnpj },
      { $set: updateData },
      { new: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // 4. If type changed, update all posts from this company
    if (typeChanged && oldCompany && oldCompany.type !== body.type) {
      await PostModel.updateMany(
        { cnpj: cnpj },
        { $set: { type: body.type } }
      );
      console.log(`Updated all posts for company ${cnpj} to type ${body.type}`);
    }

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating basic info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
