'use client';

import React from 'react';
import { ModerationProvider } from '@/components/contexts/ModerationContext';
import { CompanyModerationPage } from '@/components/moderation/CompanyModerationPage';

export default function CompaniesPage() {
  return (
    <ModerationProvider>
      <CompanyModerationPage />
    </ModerationProvider>
  );
}
