import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { UserRole, UserType } from '@/lib/models/common';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication - only moderators and super admins
    const { errorResponse } = await verifyAuth(
      request,
      [],
      [UserRole.MODERATOR, UserRole.SUPER_ADMIN]
    );

    if (errorResponse) {
      return errorResponse;
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') as UserType | null;
    const role = searchParams.get('role') as UserRole | null;
    const cnpj = searchParams.get('cnpj');
    const userId = searchParams.get('userId');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.' },
        { status: 400 }
      );
    }

    // Validate type if provided
    if (type && !Object.values(UserType).includes(type as any)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${Object.values(UserType).join(', ')}` },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !Object.values(UserRole).includes(role as any)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` },
        { status: 400 }
      );
    }

    // Build filters
    const filters: any = {};
    if (type) filters.type = type;
    if (role) filters.role = role;
    if (cnpj) filters.cnpj = cnpj;
    if (userId) filters.userId = userId;

    // Fetch paginated users
    const repository = new UserRepository();
    const result = await repository.findPaginated(filters, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
