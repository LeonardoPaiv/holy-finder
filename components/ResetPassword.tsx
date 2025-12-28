import React from 'react';
import Link from 'next/link';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { useResetPasswordViewModel } from './viewmodels/ResetPasswordViewModel';
import { ROUTES } from '@/lib/constants';

export const ResetPassword: React.FC = () => {
  const {
    newPassword,
    confirmPassword,
    loading,
    success,
    passwordsMatch,
    passwordsDontMatch,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    signOut
  } = useResetPasswordViewModel();

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">Redefinir Senha</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-2" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Nova Senha</h2>
            <p className="text-slate-500 mb-8 text-sm">
              {success 
                ? 'Sua senha foi redefinida com sucesso!'
                : 'Defina uma nova senha para sua conta. Ela deve ter no mínimo 6 caracteres.'
              }
            </p>

            {success ? (
              // Success State
              <button 
                onClick={signOut}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                Ir para o Login
              </button>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Nova Senha</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 pl-10"
                      required
                      minLength={6}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Confirmar Senha</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border transition-all text-slate-800 pl-10 pr-10 outline-none ${
                        passwordsMatch 
                          ? 'border-green-500 focus:ring-2 focus:ring-green-100' 
                          : passwordsDontMatch 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                      required
                      minLength={6}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    {passwordsMatch && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <CheckCircle size={18} />
                      </div>
                    )}
                    {passwordsDontMatch && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <XCircle size={18} />
                      </div>
                    )}
                  </div>
                  {passwordsDontMatch && (
                    <p className="text-xs text-red-500 mt-1 ml-1">As senhas não correspondem</p>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={loading || !!passwordsDontMatch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Redefinindo...</span>
                    ) : (
                      <span>Redefinir Senha</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <p className="text-center mt-6 text-xs text-slate-400 max-w-xs mx-auto">
            Após redefinir sua senha, você já estará autenticado e poderá acessar o painel.
          </p>
        </div>
      </div>
    </div>
  );
};
