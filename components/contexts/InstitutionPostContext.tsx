'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useInstitution } from './InstitutionContext';
import { CompanyService } from '@/services/companyService';

interface User {
  _id: string;
  fullName: string;
}

interface InstitutionPostContextType {
  users: User[];
  loadingUsers: boolean;
  refreshUsers: () => Promise<void>;
  onPostCreated: () => void;
  registerRefreshCallback: (callback: () => void) => void;
}

const InstitutionPostContext = createContext<InstitutionPostContextType | undefined>(undefined);

export const InstitutionPostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { institution } = useInstitution();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const refreshCallbackRef = useRef<(() => void) | null>(null);

  const loadUsers = async () => {
    if (!institution?._id) return;

    setLoadingUsers(true);
    try {
      const usersData = await CompanyService.getCompanyUsers(institution._id);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [institution?._id]);

  const registerRefreshCallback = (callback: () => void) => {
    refreshCallbackRef.current = callback;
  };

  const onPostCreated = () => {
    if (refreshCallbackRef.current) {
      refreshCallbackRef.current();
    }
  };

  const value = {
    users,
    loadingUsers,
    refreshUsers: loadUsers,
    onPostCreated,
    registerRefreshCallback,
  };

  return (
    <InstitutionPostContext.Provider value={value}>
      {children}
    </InstitutionPostContext.Provider>
  );
};

export const useInstitutionPost = () => {
  const context = useContext(InstitutionPostContext);
  if (!context) {
    throw new Error('useInstitutionPost must be used within an InstitutionPostProvider');
  }
  return context;
};
