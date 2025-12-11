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

                {/* QR Code Container */}
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-white p-2 rounded-xl border-2 border-slate-100 shadow-sm mb-3">
                        {/* Generating a static QR code for visual representation */}
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Ecclesia App6008Sao Paulo62070503***6304E2CA"
                            alt="QR Code Pix"
                            className="w-40 h-40 opacity-90 mix-blend-multiply"
                        />
                    </div>
                    <p className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">
                        Chave: pix@ecclesia.app
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95">
                        <Copy size={18} />
                        <span>Copiar Código Pix</span>
                    </button>

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
