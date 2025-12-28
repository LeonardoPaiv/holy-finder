'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { ROUTES } from '@/lib/constants';
import Cookies from 'js-cookie';
import { COOKIES } from '@/lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const router = useRouter();
  const { user, isReady, isInitializing } = useInstitution();

  useEffect(() => {
    // Wait for context to be ready before checking auth
    if (isInitializing) return;

    if (requireAuth) {
      // Check if user has auth cookies
      const hasAuthCookie = Cookies.get(COOKIES.ACCESS_TOKEN);
      
      // If no auth cookie or no user after loading, redirect to login
      if (!hasAuthCookie || (!user && isReady)) {
        router.push(ROUTES.INSTITUTION.LOGIN);
      }
    }
  }, [user, isReady, isInitializing, requireAuth, router]);

  // Show nothing while initializing
  if (isInitializing) {
    return null;
  }

  // Show nothing while redirecting
  if (requireAuth && (!Cookies.get(COOKIES.ACCESS_TOKEN) || !user)) {
    return null;
  }

  return <>{children}</>;
};
