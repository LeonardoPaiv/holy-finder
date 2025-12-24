'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { UserType, UserRole } from '@/types';
import { InstitutionLoadingScreen } from './InstitutionLoadingScreen';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredTypes?: UserType[];
  requiredRoles?: UserRole[];
  redirectTo?: string;
  loadingMessage?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredTypes = [],
  requiredRoles = [],
  redirectTo = '/institution/dashboard',
  loadingMessage = 'Verificando permissões...',
}) => {
  const router = useRouter();
  const { user, loading } = useInstitution();

  useEffect(() => {
    // Only check permissions once loading is done
    if (loading) return;

    // If no user, redirect to login
    if (!user) {
      router.push('/institution/login');
      return;
    }

    // Check type permissions
    if (requiredTypes.length > 0 && !requiredTypes.includes(user.type)) {
      router.push(redirectTo);
      return;
    }

    // Check role permissions
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push(redirectTo);
      return;
    }
  }, [user, loading, requiredTypes, requiredRoles, redirectTo, router]);

  // Show loading while checking
  if (loading) {
    return <InstitutionLoadingScreen message={loadingMessage} />;
  }

  // If no user after loading, don't render (will redirect)
  if (!user) {
    return null;
  }

  // Check permissions before rendering
  const hasTypePermission = requiredTypes.length === 0 || requiredTypes.includes(user.type);
  const hasRolePermission = requiredRoles.length === 0 || requiredRoles.includes(user.role);

  if (!hasTypePermission || !hasRolePermission) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};
