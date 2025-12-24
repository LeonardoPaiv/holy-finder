import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';
import { UserType, UserRole } from '@/lib/models/common';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    // Verify Supabase authentication (user doesn't exist in MongoDB yet)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, fullName, institution, location } = body;

    if (!email || !fullName || !institution) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify that the authenticated user matches the email being confirmed
    if (authUser.email !== email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    const userService = new UserService();
    const existingUser = await userService.getUserByEmail(email);

    // If user already exists, return it (idempotent)
    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    }

    // Create or ensure company exists
    const companyService = new CompanyService();
    const { isNew } = await companyService.createDefaultCompany(institution, location);

    // Create new user in MongoDB
    const newUser = await userService.createUser({
      email,
      fullName,
      institution,
      type: isNew ? UserType.INSTITUTION_OWNER : UserType.INACTIVE,
      role: UserRole.BASIC,
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error confirming user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
