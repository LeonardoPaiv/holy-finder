import { useState } from 'react';

interface RejectPostReportDialogViewModelProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const useRejectPostReportDialogViewModel = ({
  onConfirm,
  onClose,
}: RejectPostReportDialogViewModelProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error rejecting post report:', error);
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
