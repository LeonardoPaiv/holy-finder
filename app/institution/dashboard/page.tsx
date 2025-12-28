'use client'
import React from 'react';
import { InstitutionDashboard } from '@/components/InstitutionDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function InstitutionDashboardPage() {
    return (
        <ProtectedRoute>
            <InstitutionDashboard />
        </ProtectedRoute>
    );
}
