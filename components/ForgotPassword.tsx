import React from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useForgotPasswordViewModel } from './viewmodels/ForgotPasswordViewModel';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const {
    email,
    loading,
    emailSent,
    handleEmailChange,
    handleSubmit,
  } = useForgotPasswordViewModel();

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Recuperar Senha</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            
            {emailSent ? (
              // Success State
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Enviado!</h2>
                <p className="text-slate-500 mb-8 text-sm">
                  Enviamos um link de recuperação para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </p>

                <Link 
                  href={ROUTES.INSTITUTION.LOGIN}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  Voltar para o Login
                </Link>
              </>
            ) : (
              // Form State
              <>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-2" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Esqueceu sua senha?</h2>
                <p className="text-slate-500 mb-8 text-sm">
                  Não se preocupe! Informe seu email e enviaremos um link para redefinir sua senha.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 pl-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span>Enviando...</span>
                      ) : (
                        <span>Enviar Link de Recuperação</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link href={ROUTES.INSTITUTION.LOGIN} className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
                    Voltar para o login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
