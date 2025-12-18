import { useEffect, useState } from 'react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import toast from 'react-hot-toast';

export const useInstitutionLoginViewModel = (onLoginSuccess: () => void) => {
  const { signIn, loading, checkSession, user } = useInstitution();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      onLoginSuccess();
    } else {
      checkSession();
    }
  }, [user, checkSession, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      onLoginSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return {
    email,
    password,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};
