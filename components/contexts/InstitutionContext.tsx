'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Company } from '@/types';

interface InstitutionContextType {
  user: User | null;
  institution: Company | null;
  setUser: (user: User | null) => void;
  setInstitution: (institution: Company | null) => void;
  loading: boolean;
  isReady: boolean; // True when user AND institution are loaded (or confirmed as null)
  isInitializing: boolean; // True during first load only
  refreshData: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, cnpj: string, fullName: string, location?: { lat: number; lng: number } | null) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: (callback?: () => void) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  // Determine if context is ready
  const isReady = useMemo(() => {
    // If still loading, not ready
    if (auth.loading) return false;
    
    // If user exists, we need institution data too (unless user has no institution)
    if (auth.user) {
      // If user has institution field, wait for institution to load
      if (auth.user.institution && !auth.institution) {
        return false;
      }
      return true;
    }
    
    // If no user and not loading, we're ready (logged out state)
    return true;
  }, [auth.loading, auth.user, auth.institution]);

  // Track if this is the initial load
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  
  React.useEffect(() => {
    if (isReady && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isReady, hasLoadedOnce]);

  const isInitializing = !hasLoadedOnce;

  return (
    <InstitutionContext.Provider value={{ 
      ...auth,
      isReady,
      isInitializing,
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
