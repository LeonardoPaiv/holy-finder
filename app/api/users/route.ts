import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';
import { UserType, UserRole } from '@/lib/models/common';

export async function POST(request: NextRequest) {
    await dbConnect();
    
    try {
        const body = await request.json();
        const { email, fullName, institution } = body;

        if (!email || !fullName || !institution) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const userService = new UserService();
        const existingUser = await userService.getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Create or ensure company exists
        const companyService = new CompanyService();
        const { isNew } = await companyService.createDefaultCompany(institution, body.location);

        const newUser = await userService.createUser({
            email,
            fullName,
            institution,
            type: isNew ? UserType.INSTITUTION_ADMIN : UserType.INACTIVE,
            role: UserRole.BASIC,
        });
        
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
