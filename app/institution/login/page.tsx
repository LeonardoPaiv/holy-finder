'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionLogin } from '../../../components/InstitutionLogin';

export default function InstitutionLoginPage() {
    const router = useRouter();

    const handleLoginSuccess = () => {
        router.push('/institution/dashboard');
    };

    return (
        <InstitutionLogin
            onLoginSuccess={handleLoginSuccess}
            onBack={() => router.push('/')}
        />
    );
}
