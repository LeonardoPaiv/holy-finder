import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';
import dbConnect from '@/lib/dbConnect';
import { UserRepository } from '@/lib/repositories/UserRepository';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Verify Auth & Role
        const { errorResponse } = await verifyAuth(request, [], [UserRole.MODERATOR, UserRole.SUPER_ADMIN]);
        if (errorResponse) {
            return errorResponse;
        }

        // 2. Parse Query Parameters
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const limit = parseInt(searchParams.get('limit') || '5');

        // 3. Validate Parameters
        if (!query || query.length < 2) {
            return NextResponse.json(
                { error: 'Query must be at least 2 characters' },
                { status: 400 }
            );
        }

        if (limit < 1 || limit > 20) {
            return NextResponse.json(
                { error: 'Limit must be between 1 and 20' },
                { status: 400 }
            );
        }

        // 4. Search Users
        const userRepository = new UserRepository();
        const users = await userRepository.searchUsers(query, limit);

        return NextResponse.json(users);

    } catch (error) {
        console.error('Error searching users:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
