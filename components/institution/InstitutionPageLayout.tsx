'use client';

import React from 'react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { InstitutionLoadingScreen } from './InstitutionLoadingScreen';
import { InstitutionHeader } from './InstitutionHeader';

interface InstitutionPageLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showLogout?: boolean;
  loadingMessage?: string;
}

export const InstitutionPageLayout: React.FC<InstitutionPageLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBack,
  showLogout = true,
  loadingMessage,
}) => {
  const { loading } = useInstitution();

  // Only show loading screen during actual loading
  if (loading) {
    return <InstitutionLoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <InstitutionHeader
        title={title}
        showBackButton={showBackButton}
        onBack={onBack}
        showLogout={showLogout}
      />
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
