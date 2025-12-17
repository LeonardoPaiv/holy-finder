'use client';

import React from 'react';
import { UserControl } from '@/components/institution/UserControl';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInstitution } from '@/components/contexts/InstitutionContext';

export default function UserControlPage() {
  const router = useRouter();
  const { user } = useInstitution();

  // Redirect if not admin (double check on client side for UX)
  React.useEffect(() => {
    if (user && user.type !== 'institution admin') {
      router.push('/institution/dashboard');
    }
  }, [user, router]);

  if (!user || user.type !== 'institution admin') {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/institution/dashboard')}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar ao Painel
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Controle de Usuários
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie quem tem acesso ao painel da sua instituição.
          </p>
        </div>

        <UserControl />
      </div>
    </div>
  );
}
