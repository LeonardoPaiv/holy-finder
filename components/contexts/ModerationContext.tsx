import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModerationContextType {
  // Add moderation specific state here in the future
  isLoading: boolean;
  backHome: () => void;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const ModerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading] = useState(false);

  const router = useRouter();
  
  const backHome = () => {
    router.push(ROUTES.INSTITUTION.MODERATION);
  };

  return (
    <ModerationContext.Provider value={{ isLoading, backHome }}>
      {children}
    </ModerationContext.Provider>
  );
};

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (context === undefined) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};
