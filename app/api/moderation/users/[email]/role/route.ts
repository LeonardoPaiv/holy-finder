import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';

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
        const { role } = body;

        if (!role) {
            return NextResponse.json({ error: 'Role is required' }, { status: 400 });
        }

        // Validate role value
        if (!Object.values(UserRole).includes(role)) {
            return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
        }

        const userService = new UserService();

        // Get target user
        const targetUser = await userService.getUserByEmail(email);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Permission checks
        const isModerator = userProfile?.role === UserRole.MODERATOR;
        const isSuperAdmin = userProfile?.role === UserRole.SUPER_ADMIN;

        // Moderators cannot modify super admins
        if (isModerator && targetUser.role === UserRole.SUPER_ADMIN) {
            return NextResponse.json(
                { error: 'Moderators cannot modify super admin users' },
                { status: 403 }
            );
        }

        // Moderators can only set role to 'banned' or 'basic'
        if (isModerator && role !== UserRole.BANNED && role !== UserRole.BASIC) {
            return NextResponse.json(
                { error: 'Moderators can only set role to banned or basic' },
                { status: 403 }
            );
        }

        // Update role
        const updatedUser = await userService.updateUserRole(email, role);

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
