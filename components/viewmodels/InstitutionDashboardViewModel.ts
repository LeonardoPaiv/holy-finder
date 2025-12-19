import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';

export const useInstitutionDashboardViewModel = () => {
  const router = useRouter();
  const { signOut, user, institution } = useInstitution();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const isInactive = user?.type === 'inactive';

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleReportSubmit = () => {
    // TODO: Implement report submission logic
    console.log('Report submitted:', reportText);
    setIsReportDialogOpen(false);
    setReportText('');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleOpenReportDialog = () => setIsReportDialogOpen(true);
  const handleCloseReportDialog = () => setIsReportDialogOpen(false);

  return {
    user,
    institution,
    isInactive,
    isReportDialogOpen,
    reportText,
    setReportText,
    handleLogout,
    handleReportSubmit,
    handleNavigation,
    handleOpenReportDialog,
    handleCloseReportDialog
  };
};
