import { useState } from 'react';
import toast from 'react-hot-toast';

export const usePostReportCardViewModel = (reports: string[]) => {
  const [showAllReports, setShowAllReports] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const visibleReports = showAllReports ? reports : reports.slice(0, 3);
  const hasMoreReports = reports.length > 3;
  const remainingCount = reports.length - 3;

  const handleToggleReports = () => {
    setShowAllReports(!showAllReports);
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleCopyUserId = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      toast.success('ID copiado!');
    } catch (error) {
      console.error('Error copying user ID:', error);
      toast.error('Erro ao copiar ID');
    }
  };

  return {
    visibleReports,
    hasMoreReports,
    remainingCount,
    showAllReports,
    showFullDescription,
    handleToggleReports,
    handleToggleDescription,
    handleCopyUserId,
  };
};
