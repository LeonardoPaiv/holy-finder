import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { UserService } from '@/lib/services/UserService';

export async function POST(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    // 1. Connect to database
    await dbConnect();

    // 2. Verify authentication (moderator or super admin only)
    const { errorResponse } = await verifyAuth(
      request,
      [],
      [UserRole.MODERATOR, UserRole.SUPER_ADMIN]
    );

    if (errorResponse) {
      return errorResponse;
    }

    // 3. Validate email parameter
    const email = decodeURIComponent(params.email);
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 4. Ban user
    const service = new UserService();
    const result = await service.banUser(email);

    // 5. Return success response
    return NextResponse.json({
      message: 'User banned successfully',
      email,
      postsSuspended: result.postsSuspended,
      reportsResolved: result.reportsResolved
    });

  } catch (error: any) {
    console.error('Error banning user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
