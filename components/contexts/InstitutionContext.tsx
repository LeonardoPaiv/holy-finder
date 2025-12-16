'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Company } from '@/types';

interface InstitutionContextType {
  user: User | null;
  institution: Company | null;
  setUser: (user: User | null) => void;
  setInstitution: (institution: Company | null) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, cnpj: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: (callback?: () => void) => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <InstitutionContext.Provider value={{ 
      ...auth,
      refreshData: async () => {
        await auth.checkSession();
      }
    }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
};
