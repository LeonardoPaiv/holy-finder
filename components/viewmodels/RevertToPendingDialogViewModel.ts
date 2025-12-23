import { useState } from 'react';

interface RevertToPendingDialogViewModelProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const useRevertToPendingDialogViewModel = ({
  onConfirm,
  onClose,
}: RevertToPendingDialogViewModelProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error reverting to pending:', error);
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
