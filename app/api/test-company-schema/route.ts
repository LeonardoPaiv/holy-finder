import { NextResponse } from 'next/server';
import Company from '@/lib/models/Company';
import { Company as ICompany } from '@/types';

export async function GET() {

    try {
        const mockCompany: ICompany = {
            _id: '12345678901234', // valid CNPJ mock
            email: 'test@example.com',
            name: 'Imaculado Coração',
            geo: {
                type: 'Point',
                coordinates: [-46.6333, -23.5505]
            },
            type: 'Católica',
            events: [
                {
                    name: 'Grupo de Oração',
                    days: ['Segunda'],
                    hours: ['20:00'],
                    description: 'Reunião semanal'
                }
            ],
            missas: [],
            level: 'comum'
        };

        // Try to validate without saving (or we can save and delete, but validate is enough for schema check)
        const company = new Company(mockCompany);
        await company.validate();

        return NextResponse.json({ success: true, message: 'Company schema validation passed', data: mockCompany });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
