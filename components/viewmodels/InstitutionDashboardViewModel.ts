import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { ReportService } from '@/services/reportService';
import { ReportType } from '@/types';
import toast from 'react-hot-toast';

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

  const handleReportSubmit = async () => {
    if (!reportText.trim() || !user?.institution || !user?._id) return;

    try {
      await ReportService.createReport({
        type: ReportType.INSTITUTION_INTERN_REPORT,
        description: reportText,
        cnpj: user.institution,
        userId: user._id
      });
      toast.success('Report enviado com sucesso!');
      setIsReportDialogOpen(false);
      setReportText('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Erro ao enviar report. Tente novamente.');
    }
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
