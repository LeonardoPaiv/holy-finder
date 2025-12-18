import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { useApp } from '@/components/AppContext';
import { cnpj } from 'cpf-cnpj-validator';
import toast from 'react-hot-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ROUTES } from '@/lib/constants';

export const useInstitutionSignupViewModel = () => {
  const router = useRouter();
  const { signUp, loading } = useInstitution();
  const { userLocation } = useApp();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCnpjValue(cnpj.format(value));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFocusPassword = () => setIsPasswordFocused(true);
  const handleBlurPassword = () => setIsPasswordFocused(false);

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) {
      toast.error('Por favor, informe seu nome e sobrenome');
      return;
    }

    if (!cnpj.isValid(cnpjValue)) {
      toast.error('CNPJ inválido');
      return;
    }

    if (!isPasswordValid) {
      toast.error('A senha não atende aos requisitos de segurança');
      return;
    }

    if (!captchaToken) {
      toast.error('Por favor, complete o captcha');
      return;
    }

    try {
      const rawCnpj = cnpjValue.replace(/\D/g, '');
      await signUp(email, password, rawCnpj, fullName, userLocation);
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
    fullName,
    password,
    passwordRequirements,
    isPasswordValid,
    isPasswordFocused,
    cnpjValue,
    loading,
    captchaToken,
    setCaptchaToken,
    captchaRef,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleCnpjChange,
    handleFocusPassword,
    handleBlurPassword,
    handleSubmit,
  };
};
