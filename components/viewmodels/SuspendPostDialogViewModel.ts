import { useState } from 'react';
import toast from 'react-hot-toast';

interface SuspendPostDialogViewModelProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const useSuspendPostDialogViewModel = ({
  onConfirm,
  onClose,
}: SuspendPostDialogViewModelProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast.success('Post suspenso com sucesso');
      onClose();
    } catch (error) {
      console.error('Error suspending post:', error);
      toast.error('Erro ao suspender post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return {
    isLoading,
    handleConfirm,
    handleClose,
  };
};
