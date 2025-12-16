'use client';

import React from 'react';
import { InstitutionProvider } from '@/components/contexts/InstitutionContext';

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstitutionProvider>
      {children}
    </InstitutionProvider>
  );
}
