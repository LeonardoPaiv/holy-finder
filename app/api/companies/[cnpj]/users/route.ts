import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/User';
import { validateCompanyRequest } from '@/lib/apiUtils';
import { UserType } from '@/lib/models/common';

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;

    // 1. Verify Authentication & Permissions
    const { errorResponse, userProfile } = await validateCompanyRequest(request, cnpj, [UserType.INSTITUTION_ADMIN, UserType.COMUM]);
    if (errorResponse) return errorResponse;

    // 2. Fetch Users
    let users;
    if (userProfile!.type === UserType.COMUM) {
      // For comum users, return only _id and fullName
      users = await UserModel.find({ institution: cnpj }).select('_id fullName');
    } else {
      // For institution admins, return all fields
      users = await UserModel.find({ institution: cnpj }).select('_id fullName email type');
    }

    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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
    const { _id, type } = body;
    if (!_id || !type) {
        return NextResponse.json({ error: 'Missing _id or type' }, { status: 400 });
    }

    // 3. Find and Update User
    const targetUser = await UserModel.findOne({ _id });

    if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.institution !== cnpj) {
        return NextResponse.json({ error: 'Forbidden: User does not belong to this institution' }, { status: 403 });
    }

    targetUser.type = type;
    await targetUser.save();

    return NextResponse.json({
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        type: targetUser.type
    });

  } catch (error) {
    console.error('Error updating user type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
