'use client';

import React from 'react';
import { ModerationProvider } from '@/components/contexts/ModerationContext';
import { ModerationDashboard } from '@/components/moderation/ModerationDashboard';

export default function ModerationPage() {
  return (
    <ModerationProvider>
      <ModerationDashboard />
    </ModerationProvider>
  );
}
