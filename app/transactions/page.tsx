'use client';

import React from 'react';
import { ArrowLeft, FileText, Server, HandHeart, Download, Loader2 } from 'lucide-react';
import { useTransactionsPageViewModel } from '@/components/viewmodels/TransactionsPageViewModel';

export default function TransactionsPage() {
    const {
        transactions,
        loading,
        error,
        hasMore,
        handleLoadMore,
        handleGoBack
    } = useTransactionsPageViewModel();

    const formatDate = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatValue = (value: number, unit: string) => {
        return `${unit} ${value.toFixed(2)}`;
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center space-x-4 sticky top-0 z-10">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-bold text-slate-800">Movimentações</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="max-w-md mx-auto space-y-4">

                    {/* Loading State */}
                    {loading && transactions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 size={40} className="text-slate-400 animate-spin mb-4" />
                            <p className="text-sm text-slate-500">Carregando movimentações...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <FileText size={40} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Erro ao carregar</h3>
                            <p className="text-sm text-slate-500 max-w-xs">{error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && transactions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <FileText size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma movimentação ainda</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Assim que houverem gastos com o app ou doações para caridade, os comprovantes aparecerão aqui com total transparência.
                            </p>
                        </div>
                    )}

                    {/* Transaction List */}
                    {!error && transactions.length > 0 && (
                        <>
                            {transactions.map((t) => (
                                <div
                                    key={t._id}
                                    className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all
                                        ${t.category === 'bill' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}
                                    `}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-full shrink-0
                                            ${t.category === 'bill' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                                        `}>
                                            {t.category === 'bill' ? <Server size={20} /> : <HandHeart size={20} />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${t.category === 'bill' ? 'text-red-900' : 'text-blue-900'}`}>
                                                {t.title}
                                            </p>
                                            <p className={`text-xs ${t.category === 'bill' ? 'text-red-600' : 'text-blue-600'}`}>
                                                {formatDate(t.createdAt)}
                                            </p>
                                            {t.description && (
                                                <p className={`text-xs mt-1 ${t.category === 'bill' ? 'text-red-700' : 'text-blue-700'}`}>
                                                    {t.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end space-y-1">
                                        <span className={`font-bold ${t.category === 'bill' ? 'text-red-700' : 'text-blue-700'}`}>
                                            {formatValue(t.value, t.unit)}
                                        </span>
                                        {t.photo && (
                                            <a
                                                href={t.photo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center space-x-1 text-xs underline
                                                    ${t.category === 'bill' ? 'text-red-500 hover:text-red-700' : 'text-blue-500 hover:text-blue-700'}
                                                `}
                                            >
                                                <Download size={12} />
                                                <span>Comprovante</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Load More Button */}
                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Carregando...</span>
                                        </>
                                    ) : (
                                        <span>Carregar mais</span>
                                    )}
                                </button>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

