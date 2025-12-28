import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CompanyModel from '@/lib/models/Company';
import { validateCompanyRequest } from '@/lib/apiUtils';
import { UserType } from '@/lib/models/common';

export async function PATCH(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;
    const body = await request.json();

    // 1. Verify Authentication & Permissions
    const { errorResponse } = await validateCompanyRequest(request, cnpj, [UserType.INSTITUTION_ADMIN, UserType.COMUM, UserType.INSTITUTION_OWNER]);
    if (errorResponse) return errorResponse;

    // 2. Validate Events
    if (!Array.isArray(body.events)) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }


    // Validate each event has either days or dates
    for (const event of body.events) {
        const hasDays = event.days && event.days.length > 0;
        const hasDates = event.dates && event.dates.length > 0;
        
        if (!hasDays && !hasDates) {
            return NextResponse.json({ 
                error: 'Each event must have either days or dates',
                event: event.name 
            }, { status: 400 });
        }
    }

    // 3. Update Events
    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: cnpj },
      { $set: { events: body.events } },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }


    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error('Error updating events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
