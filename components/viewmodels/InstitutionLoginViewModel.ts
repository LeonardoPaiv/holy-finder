import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export const useInstitutionLoginViewModel = (onLoginSuccess: () => void) => {
  const { signIn, loading, checkSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      onLoginSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
    }
  };

  useEffect(() => {
    checkSession(onLoginSuccess);
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
};
