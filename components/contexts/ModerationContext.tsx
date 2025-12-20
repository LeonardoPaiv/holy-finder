import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModerationContextType {
  // Add moderation specific state here in the future
  isLoading: boolean;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const ModerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading] = useState(false);

  return (
    <ModerationContext.Provider value={{ isLoading }}>
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
