'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface InstitutionLoadingScreenProps {
  message?: string;
}

export const InstitutionLoadingScreen: React.FC<InstitutionLoadingScreenProps> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/logo.webp" 
          alt="Logo" 
          className="w-16 h-16 object-contain animate-pulse" 
        />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};
