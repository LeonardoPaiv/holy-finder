import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import toast from 'react-hot-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ROUTES } from '@/lib/constants';

export const useInstitutionSignupViewModel = () => {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCnpjValue(cnpj.format(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cnpj.isValid(cnpjValue)) {
      toast.error('CNPJ inválido');
      return;
    }

    if (!captchaToken) {
      toast.error('Por favor, complete o captcha');
      return;
    }

    try {
      await signUp(email, password, cnpjValue);
      toast.success('Cadastro realizado com sucesso! Verifique seu email.');
      router.push(ROUTES.INSTITUTION.LOGIN);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    cnpjValue,
    handleCnpjChange,
    loading,
    captchaToken,
    setCaptchaToken,
    captchaRef,
    handleSubmit,
  };
};
