import { NextResponse } from 'next/server';
import UserModel from '@/lib/models/User';
import { supabase } from '@/lib/supabase';
import { UserRole } from './models/common';
import { User } from '@/types';

interface ValidationResult {
  userProfile?: User | null;
  errorResponse?: NextResponse;
}

export async function verifyAuth(
  request: Request,
  allowedTypes: string[] = [],
  allowedRoles: string[] = [],
  allowBanned: boolean = false
): Promise<ValidationResult> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const userProfile: User | null = await UserModel.findOne({ email: user.email });
    if (!userProfile) {
      return { errorResponse: NextResponse.json({ error: 'User profile not found' }, { status: 404 }) };
    }

    if (!allowBanned && userProfile.role === UserRole.BANNED) {
      return { errorResponse: NextResponse.json({ error: 'User is banned' }, { status: 403 }) };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(userProfile.type)) {
      return { errorResponse: NextResponse.json({ error: 'Forbidden: Insufficient permissions (Type)' }, { status: 403 }) };
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
      return { errorResponse: NextResponse.json({ error: 'Forbidden: Insufficient permissions (Role)' }, { status: 403 }) };
    }

    return { userProfile };
  } catch (error) {
    console.error('Error in verifyAuth:', error);
    return { errorResponse: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}

export async function validateCompanyRequest(
  request: Request,
  cnpj: string,
  allowedTypes: string[] = []
): Promise<ValidationResult> {
  try {
    const { userProfile, errorResponse } = await verifyAuth(request, allowedTypes);

    if (errorResponse) {
      return { errorResponse };
    }

    if (!userProfile || userProfile.institution !== cnpj) {
      return { errorResponse: NextResponse.json({ error: 'Forbidden: You do not belong to this institution' }, { status: 403 }) };
    }

    return { userProfile };

  } catch (error) {
    console.error('Error in validateCompanyRequest:', error);
    return { errorResponse: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}
