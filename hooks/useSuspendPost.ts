import { useState } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportStatus } from '@/types';

interface UseSuspendPostProps {
  onSuccess?: () => void;
}

export const useSuspendPost = ({ onSuccess }: UseSuspendPostProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{
    postId: string;
    postReportId: string;
  } | null>(null);

  const openSuspendDialog = (postId: string, postReportId: string) => {
    setSelectedPost({ postId, postReportId });
    setIsDialogOpen(true);
  };

  const closeSuspendDialog = () => {
    setIsDialogOpen(false);
    setSelectedPost(null);
  };

  const confirmSuspend = async () => {
    if (!selectedPost) return;

    // Execute both operations in parallel
    await Promise.all([
      ModerationService.updatePostSuspendedStatus(selectedPost.postId, true),
      ModerationService.updatePostReportStatus(selectedPost.postReportId, ReportStatus.SOLVED)
    ]);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    isDialogOpen,
    selectedPost,
    openSuspendDialog,
    closeSuspendDialog,
    confirmSuspend,
  };
};
