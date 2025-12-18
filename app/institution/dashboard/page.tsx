'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { InstitutionDashboard } from '@/components/InstitutionDashboard';

export default function InstitutionDashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Check for hash parameters (from Supabase redirect)
        if (typeof window === 'undefined') return;
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
                Cookies.set('sb-access-token', accessToken, { expires: 7 });
            }
            if (refreshToken) {
                Cookies.set('sb-refresh-token', refreshToken, { expires: 7 });
            }

            // Clear hash
            router.replace('/institution/dashboard');
        }
    }, [router]);

    return <InstitutionDashboard />;
}
