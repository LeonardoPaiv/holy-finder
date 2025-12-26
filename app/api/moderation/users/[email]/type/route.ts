import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole, UserType } from '@/lib/models/common';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
    await dbConnect();

    const email = params.email;

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify authentication - must be moderator or super admin
    const { userProfile, errorResponse } = await verifyAuth(
        request,
        [],
        [UserRole.MODERATOR, UserRole.SUPER_ADMIN]
    );

    if (errorResponse) {
        return errorResponse;
    }

    try {
        const body = await request.json();
        const { type } = body;

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        // Validate type value
        if (!Object.values(UserType).includes(type)) {
            return NextResponse.json({ error: 'Invalid type value' }, { status: 400 });
        }

        const userService = new UserService();

        // Get target user
        const targetUser = await userService.getUserByEmail(email);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Permission checks
        const isModerator = userProfile?.role === UserRole.MODERATOR;

        // Moderators cannot modify super admins
        if (isModerator && targetUser.role === UserRole.SUPER_ADMIN) {
            return NextResponse.json(
                { error: 'Moderators cannot modify super admin users' },
                { status: 403 }
            );
        }

        // Update type
        const updatedUser = await userService.updateUserType(email, type);

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user type:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
