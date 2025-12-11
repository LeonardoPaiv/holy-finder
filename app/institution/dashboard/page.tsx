'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionDashboard } from '../../../components/InstitutionDashboard';

export default function InstitutionDashboardPage() {
    const router = useRouter();
    return <InstitutionDashboard onBack={() => router.push('/')} />;
}
