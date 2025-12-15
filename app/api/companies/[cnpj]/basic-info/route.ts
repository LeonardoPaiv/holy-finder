import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CompanyModel from '@/lib/models/Company';
import UserModel from '@/lib/models/User';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;
    const body = await request.json();

    // 1. Verify Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify User Permission (Must be "institution admin" and belong to this company)
    const userProfile = await UserModel.findOne({ email: user.email });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (userProfile.institution !== cnpj) {
      return NextResponse.json({ error: 'Forbidden: You do not belong to this institution' }, { status: 403 });
    }

    if (userProfile.type !== 'institution admin') {
      return NextResponse.json({ error: 'Forbidden: Only admins can edit basic info' }, { status: 403 });
    }

    // 3. Update Basic Info
    const allowedFields = ['name', 'email', 'tel', 'address', 'geo'];
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

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating basic info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
