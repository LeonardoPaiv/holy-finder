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

    // 2. Verify User Permission (Must belong to this company, can be "institution admin" or "comum")
    const userProfile = await UserModel.findOne({ email: user.email });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (userProfile.institution !== cnpj) {
      return NextResponse.json({ error: 'Forbidden: You do not belong to this institution' }, { status: 403 });
    }

    // Both 'institution admin' and 'comum' can edit events, so we just check if they are valid types
    // Assuming 'comum' here refers to a standard member of the institution.
    // If 'comum' means a regular app user not associated with an institution, the logic above (institution check) handles it.
    // If the user type check is strict:
    if (!['institution admin', 'comum'].includes(userProfile.type)) {
         return NextResponse.json({ error: 'Forbidden: Invalid user type' }, { status: 403 });
    }

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
