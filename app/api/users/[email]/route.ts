import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import dbConnect from '@/lib/dbConnect';

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
    await dbConnect();
    const email = params.email;

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
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
