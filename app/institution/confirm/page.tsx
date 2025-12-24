'use client';

import React from 'react';
import { useConfirmEmailViewModel } from '@/components/viewmodels/ConfirmEmailViewModel';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ConfirmEmailPage() {
  const { loading, error } = useConfirmEmailViewModel();

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-2" />
          </div>

          {loading && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Confirmando seu email
              </h2>
              <p className="text-slate-500 text-sm">
                Aguarde enquanto processamos sua confirmação...
              </p>
            </>
          )}

          {error && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Erro na confirmação
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {error}
              </p>
              <button
                onClick={() => window.location.href = '/institution/login'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all"
              >
                Voltar ao Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
