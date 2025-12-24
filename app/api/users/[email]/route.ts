import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
    await dbConnect();
    
    const email = params.email;

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify authentication
    const { userProfile, errorResponse } = await verifyAuth(request);
    
    if (errorResponse) {
        return errorResponse;
    }

    // Users can only fetch their own data, unless they're moderators/admins
    const isModerator = userProfile?.role === UserRole.MODERATOR || userProfile?.role === UserRole.SUPER_ADMIN;
    const isOwnData = userProfile?.email === email;

    if (!isOwnData && !isModerator) {
        return NextResponse.json({ error: 'Forbidden: You can only access your own user data' }, { status: 403 });
    }

    const service = new UserService();
    try {
        const user = await service.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
