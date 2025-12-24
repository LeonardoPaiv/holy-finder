import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportStatus } from '@/types';

interface UseSolveReportProps {
  onSuccess?: () => void;
}

export const useSolveReport = ({ onSuccess }: UseSolveReportProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const openSolveDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsDialogOpen(true);
  };

  const closeSolveDialog = () => {
    setIsDialogOpen(false);
    setSelectedReportId(null);
  };

  const confirmSolve = async () => {
    if (!selectedReportId) return;

    await ModerationService.updateReportStatus(selectedReportId, ReportStatus.SOLVED);

    if (onSuccess) {
      onSuccess();
    }

    closeSolveDialog();
  };

  return {
    isDialogOpen,
    selectedReportId,
    openSolveDialog,
    closeSolveDialog,
    confirmSolve,
  };
};
