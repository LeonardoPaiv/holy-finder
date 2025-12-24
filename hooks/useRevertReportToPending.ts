import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportStatus } from '@/types';

interface UseRevertReportToPendingProps {
  onSuccess?: () => void;
}

export const useRevertReportToPending = ({ onSuccess }: UseRevertReportToPendingProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const openRevertDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsDialogOpen(true);
  };

  const closeRevertDialog = () => {
    setIsDialogOpen(false);
    setSelectedReportId(null);
  };

  const confirmRevert = async () => {
    if (!selectedReportId) return;

    await ModerationService.updateReportStatus(selectedReportId, ReportStatus.PENDING);

    if (onSuccess) {
      onSuccess();
    }

    closeRevertDialog();
  };

  return {
    isDialogOpen,
    selectedReportId,
    openRevertDialog,
    closeRevertDialog,
    confirmRevert,
  };
};
