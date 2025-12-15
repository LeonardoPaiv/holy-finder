import React from 'react';
import { Building, ArrowLeft, Lock, ChevronRight, Mail } from 'lucide-react';
import { useInstitutionLoginViewModel } from './viewmodels/InstitutionLoginViewModel';
import { ROUTES } from '@/lib/constants';

interface InstitutionLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const InstitutionLogin: React.FC<InstitutionLoginProps> = ({ onLoginSuccess, onBack }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  } = useInstitutionLoginViewModel(onLoginSuccess);

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
        <h1 className="text-lg font-bold text-slate-800">Área da Instituição</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 rotate-3">
              <Building size={32} />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo(a)</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Gerencie as informações da sua paróquia ou comunidade.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Senha</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
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
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <span>Acessar Painel</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
                Esqueci minha senha
              </a>
            </div>

            <div className="mt-2 text-center">
              <a href={ROUTES.INSTITUTION.SIGNUP} className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
                Registrar-se
              </a>
            </div>
          </div>
          
          <p className="text-center mt-6 text-xs text-slate-400 max-w-xs mx-auto">
            Ao entrar, você concorda com os termos de uso do Ecclesia Locator para instituições parceiras.
          </p>
        </div>
      </div>
    </div>
  );
};