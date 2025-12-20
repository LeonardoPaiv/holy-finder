import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { ROUTES } from '@/lib/constants';

export const useModerationDashboardViewModel = () => {
  const router = useRouter();
  const { user, loading } = useInstitution();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(ROUTES.INSTITUTION.LOGIN);
        return;
      }

      const isModerator = user.type === 'moderator' || user.type === 'super admin';
      if (!isModerator) {
        router.push(ROUTES.INSTITUTION.DASHBOARD);
      }
    }
  }, [user, loading, router]);

  const handleBack = () => {
    router.push(ROUTES.INSTITUTION.DASHBOARD);
  };

  return {
    user,
    loading,
    handleBack,
  };
};
