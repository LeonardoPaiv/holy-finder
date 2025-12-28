'use client';

import React from 'react';
import { ForgotPassword } from '@/components/ForgotPassword';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push(ROUTES.INSTITUTION.LOGIN);
  };

  return <ForgotPassword onBack={handleBack} />;
}
