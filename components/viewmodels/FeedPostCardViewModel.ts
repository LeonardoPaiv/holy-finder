import { useState } from 'react';
import { Post } from '@/types';
import { shareContent } from '@/utils/shareUtils';

export const useFeedPostCardViewModel = (post: Post & { cnpj?: { _id: string; name: string } }) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const formatDate = (dateString: Date | string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feed?postId=${post._id}`;
    const shareData = {
      title: post.cnpj?.name || 'Post',
      text: post.description || 'Confira este post',
      url: shareUrl,
    };

    shareContent(shareData);
  };

  const handleOpenReportDialog = () => {
    setIsReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
  };

  return {
    formatDate,
    handleShare,
    isReportDialogOpen,
    handleOpenReportDialog,
    handleCloseReportDialog,
  };
};
