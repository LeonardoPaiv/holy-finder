import { useState } from 'react';
import toast from 'react-hot-toast';

interface BanUserDialogViewModelProps {
  userName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const useBanUserDialogViewModel = ({
  userName,
  onConfirm,
  onClose,
}: BanUserDialogViewModelProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isConfirmValid = confirmText === 'BANIR';

  const handleConfirm = async () => {
    if (!isConfirmValid) return;

    setIsLoading(true);
    try {
      await onConfirm();
      toast.success(`Usuário ${userName} foi banido com sucesso`);
      onClose();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Erro ao banir usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText('');
      onClose();
    }
  };

  return {
    confirmText,
    setConfirmText,
    isLoading,
    isConfirmValid,
    handleConfirm,
    handleClose,
  };
};
