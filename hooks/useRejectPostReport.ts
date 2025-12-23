import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportStatus } from '@/types';

interface UseRejectPostReportProps {
  onSuccess?: () => void;
}

export const useRejectPostReport = ({ onSuccess }: UseRejectPostReportProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPostReport, setSelectedPostReport] = useState<{
    postReportId: string;
    postId: string;
  } | null>(null);

  const openRejectDialog = (postReportId: string, postId: string) => {
    setSelectedPostReport({ postReportId, postId });
    setIsDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setIsDialogOpen(false);
    setSelectedPostReport(null);
  };

  const confirmReject = async () => {
    if (!selectedPostReport) return;

    await ModerationService.updatePostReportStatus(
      selectedPostReport.postReportId,
      ReportStatus.REJECTED
    );

    if (onSuccess) {
      onSuccess();
    }

    closeRejectDialog();
  };

  return {
    isDialogOpen,
    selectedPostReport,
    openRejectDialog,
    closeRejectDialog,
    confirmReject,
  };
};
