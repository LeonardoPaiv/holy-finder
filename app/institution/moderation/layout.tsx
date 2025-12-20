'use client';

import React from 'react';
import { ModerationProvider } from '@/components/contexts/ModerationContext';

export default function ModerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModerationProvider>
      {children}
    </ModerationProvider>
  );
}
