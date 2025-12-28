import { useEffect, useState } from 'react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import toast from 'react-hot-toast';

export const useInstitutionLoginViewModel = (onLoginSuccess: () => void) => {
  const { signIn, loading, checkSession, user, institution } = useInstitution();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Only auto-redirect if user exists AND has institution data loaded
    // This prevents redirect loop when user is authenticated but data hasn't loaded
    if (user && institution) {
      onLoginSuccess();
    } else if (!user) {
      checkSession();
    }
  }, [user, institution, checkSession, onLoginSuccess]);

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
