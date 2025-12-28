import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/lib/services/TransactionService';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserRole } from '@/lib/models/common';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const donatorId = searchParams.get('donatorId') || undefined;
    const category = searchParams.get('category') as 'donation' | 'bill' | null;
    
    // Validate page and limit
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid page or limit parameters' },
        { status: 400 }
      );
    }
    
    // Validate category if provided
    if (category && category !== 'donation' && category !== 'bill') {
      return NextResponse.json(
        { error: 'Invalid category. Must be "donation" or "bill"' },
        { status: 400 }
      );
    }
    
    const service = new TransactionService();
    const result = await service.getTransactionsPaginated(
      {
        donatorId,
        category: category || undefined
      },
      page,
      limit
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Verify user is super admin
    const { errorResponse } = await verifyAuth(
      request,
      [],
      [UserRole.SUPER_ADMIN]
    );
    
    if (errorResponse) {
      return errorResponse;
    }
    
    const body = await request.json();
    
    // Validate required fields
    const { photo, title, category, description, value, unit, donatorId } = body;
    
    if (!photo || !title || !category || !description || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: photo, title, category, description, value' },
        { status: 400 }
      );
    }
    
    const service = new TransactionService();
    const transaction = await service.createTransaction({
      photo,
      title,
      category,
      description,
      value,
      unit: unit || 'R$',
      donatorId
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    
    // Return validation errors with 400
    if (error.message && (
      error.message.includes('Missing required fields') ||
      error.message.includes('Invalid category') ||
      error.message.includes('Invalid unit') ||
      error.message.includes('Value must be positive')
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
