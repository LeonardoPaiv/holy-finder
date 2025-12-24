'use client'
import React from 'react';
import { InstitutionDataEditor } from '../../../components/InstitutionDataEditor';
import { InstitutionPageLayout } from '@/components/institution/InstitutionPageLayout';

export default function InstitutionDataPage() {
    return (
        <InstitutionPageLayout title="Dados da Instituição" showBackButton>
            <InstitutionDataEditor />
        </InstitutionPageLayout>
    );
}
