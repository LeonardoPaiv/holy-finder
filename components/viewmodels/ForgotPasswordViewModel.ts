import { useState } from 'react';
import { AuthService } from '@/services/authService';
import toast from 'react-hot-toast';

export const useForgotPasswordViewModel = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor, informe seu email');
      return;
    }

    setLoading(true);
    try {
      await AuthService.requestPasswordReset(email);
      setEmailSent(true);
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    emailSent,
    handleEmailChange,
    handleSubmit,
  };
};
