import { useState } from 'react';
import { AuthService } from '@/services/authService';
import toast from 'react-hot-toast';
import { COOKIES, ROUTES } from '@/lib/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const useResetPasswordViewModel = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      toast.success('Senha redefinida com sucesso! Você já está autenticado.');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

    const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      Cookies.remove(COOKIES.ACCESS_TOKEN);
      Cookies.remove(COOKIES.REFRESH_TOKEN);
      router.push(ROUTES.INSTITUTION.LOGIN);
    } catch (error) {
      console.error('Error logging out:', error);
      // Force redirect even if error
      router.push(ROUTES.INSTITUTION.LOGIN);
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
    success,
    passwordsMatch,
    passwordsDontMatch,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    signOut,
  };
};
