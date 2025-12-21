import { useState } from 'react';
import { PostReportService } from '@/services/postReportService';
import toast from 'react-hot-toast';

export const useReportPostDialogViewModel = (postId: string, onClose: () => void) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (value: string) => {
    setComment(value);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Por favor, descreva o problema');
      return;
    }

    if (comment.length > 500) {
      toast.error('O comentário deve ter no máximo 500 caracteres');
      return;
    }

    setIsSubmitting(true);
    try {
      await PostReportService.reportPost(postId, comment.trim());
      toast.success('Denúncia enviada com sucesso!');
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Erro ao enviar denúncia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    onClose();
  };

  return {
    comment,
    isSubmitting,
    handleCommentChange,
    handleSubmit,
    handleCancel,
  };
};
