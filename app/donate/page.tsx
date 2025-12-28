'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Copy, FileText } from 'lucide-react';

export default function DonatePage() {
    const router = useRouter();

    const handleViewTransactions = () => {
        router.push('/transactions');
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50 pb-32 pt-6 px-4">
            <div className="max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-xl text-center border border-slate-100">

                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <Heart size={28} fill="currentColor" />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">Apoie Nossa Missão</h2>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        As doações são essenciais para manter o aplicativo funcionando.
                        <span className="block mt-2 font-medium text-slate-800">
                            Todo valor excedente aos custos será doado integralmente para instituições de caridade cadastradas.
                        </span>
                    </p>
                </div>

                {/* Placeholder for donations coming soon */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="text-blue-500" fill="currentColor" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Obrigado pelo Interesse!</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Em breve será possível fazer doações para apoiar nossa missão. 
                        Estamos trabalhando para disponibilizar essa funcionalidade o mais rápido possível.
                    </p>
                </div>

                <div className="space-y-3">

                    <button
                        onClick={handleViewTransactions}
                        className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                        <FileText size={18} />
                        <span>Ver Prestação de Contas</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
