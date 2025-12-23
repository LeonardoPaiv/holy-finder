import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';

interface UseRevertToPendingProps {
  onSuccess?: () => void;
}

export const useRevertToPending = ({ onSuccess }: UseRevertToPendingProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    postReportId: string;
    postId: string;
  } | null>(null);

  const openRevertDialog = (postReportId: string, postId: string) => {
    setSelectedReport({ postReportId, postId });
    setIsDialogOpen(true);
  };

  const closeRevertDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  };

  const confirmRevert = async () => {
    if (!selectedReport) return;

    await ModerationService.revertToPending(
      selectedReport.postId,
      selectedReport.postReportId
    );

    if (onSuccess) {
      onSuccess();
    }

    closeRevertDialog();
  };

  return {
    isDialogOpen,
    selectedReport,
    openRevertDialog,
    closeRevertDialog,
    confirmRevert,
  };
};
