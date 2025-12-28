import { useState } from 'react';
import { AuthService } from '@/services/authService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export const useResetPasswordViewModel = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não correspondem');
      return;
    }

    setLoading(true);
    try {
      await AuthService.updatePassword(newPassword);
      toast.success('Senha redefinida com sucesso!');
      
      // Redireciona para o dashboard após 1 segundo
      setTimeout(() => {
        router.push(ROUTES.INSTITUTION.DASHBOARD);
      }, 1000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  return {
    newPassword,
    confirmPassword,
    loading,
    passwordsMatch,
    passwordsDontMatch,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
};
