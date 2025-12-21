import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ModerationService, ModerationStatus } from '@/services/moderationService';

interface ModerationContextType {
  isLoading: boolean;
  backHome: () => void;
  status: ModerationStatus | null;
  loadingStatus: boolean;
  refreshStatus: () => Promise<void>;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const ModerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading] = useState(false);
  const [status, setStatus] = useState<ModerationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const router = useRouter();
  
  const backHome = () => {
    router.push(ROUTES.INSTITUTION.MODERATION);
  };

  const fetchStatus = async () => {
    try {
      const data = await ModerationService.getStatus();
      if (data) {
        setStatus(data);
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const refreshStatus = async () => {
    setLoadingStatus(true);
    await fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <ModerationContext.Provider value={{ isLoading, backHome, status, loadingStatus, refreshStatus }}>
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
