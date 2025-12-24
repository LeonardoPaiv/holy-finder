'use client';

import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';

interface InstitutionHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showLogout?: boolean;
}

export const InstitutionHeader: React.FC<InstitutionHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  showLogout = true,
}) => {
  const router = useRouter();
  const { signOut } = useInstitution();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
          )}
          <img src="/logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        
        {showLogout && (
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span className="hidden md:inline text-sm font-medium">Sair</span>
          </button>
        )}
      </div>
    </div>
  );
};
