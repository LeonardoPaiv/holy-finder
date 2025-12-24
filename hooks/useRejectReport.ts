import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportStatus } from '@/types';

interface UseRejectReportProps {
  onSuccess?: () => void;
}

export const useRejectReport = ({ onSuccess }: UseRejectReportProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const openRejectDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setIsDialogOpen(false);
    setSelectedReportId(null);
  };

  const confirmReject = async () => {
    if (!selectedReportId) return;

    await ModerationService.updateReportStatus(selectedReportId, ReportStatus.REJECTED);

    if (onSuccess) {
      onSuccess();
    }

    closeRejectDialog();
  };

  return {
    isDialogOpen,
    selectedReportId,
    openRejectDialog,
    closeRejectDialog,
    confirmReject,
  };
};
