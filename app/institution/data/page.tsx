'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionDataEditor } from '../../../components/InstitutionDataEditor';

export default function InstitutionDataPage() {
    const router = useRouter();
    return <InstitutionDataEditor onBack={() => router.push('/institution/dashboard')} />;
}
