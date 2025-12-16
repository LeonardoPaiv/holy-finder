import { NextResponse } from 'next/server';
import UserModel from '@/lib/models/User';
import { supabase } from '@/lib/supabase';

interface ValidationResult {
  userProfile?: any;
  errorResponse?: NextResponse;
}

export async function validateCompanyRequest(
  request: Request,
  cnpj: string,
  allowedRoles: string[] = []
): Promise<ValidationResult> {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    // 2. Verify User Permission
    const userProfile = await UserModel.findOne({ email: user.email });
    if (!userProfile) {
      return { errorResponse: NextResponse.json({ error: 'User profile not found' }, { status: 404 }) };
    }

    if (userProfile.institution !== cnpj) {
      return { errorResponse: NextResponse.json({ error: 'Forbidden: You do not belong to this institution' }, { status: 403 }) };
    }

    if (!allowedRoles.includes(userProfile.type)) {
      return { errorResponse: NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 }) };
    }

    return { userProfile };

  } catch (error) {
    console.error('Error in validateCompanyRequest:', error);
    return { errorResponse: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }) };
  }
}
