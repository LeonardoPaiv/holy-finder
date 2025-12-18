import { Post } from '@/types';
import toast from 'react-hot-toast';

export const useFeedPostCardViewModel = (post: Post & { cnpj?: { _id: string; name: string } }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/feed?postId=${post._id}`;
    const shareData = {
      title: `Post de ${post.cnpj?.name || 'Instituição'}`,
      text: post.description.substring(0, 100) + (post.description.length > 100 ? '...' : ''),
      url: shareUrl,
    };

    // Try native share API (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copiado para a área de transferência!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Erro ao copiar link');
      }
    }
  };

  return {
    formatDate,
    handleShare,
  };
};
