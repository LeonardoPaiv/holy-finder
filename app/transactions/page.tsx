'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Server, HandHeart, Download } from 'lucide-react';
import { TransactionService } from '../../services/transactionService';
import { Transaction } from '../../types';

export default function TransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await TransactionService.getTransactions();
            setTransactions(data);
        };
        loadData();
    }, []);

    return (
        <div className="w-full h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center space-x-4 sticky top-0 z-10">
                <button
                    onClick={() => router.push('/donate')}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-bold text-slate-800">Movimentações</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="max-w-md mx-auto space-y-4">

                    {transactions.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <FileText size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma movimentação ainda</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Assim que houverem gastos com o app ou doações para caridade, os comprovantes aparecerão aqui com total transparência.
                            </p>
                        </div>
                    ) : (
                        /* Transaction List */
                        transactions.map((t) => (
                            <div
                                key={t.id}
                                className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all
                  ${t.type === 'APP_EXPENSE' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}
                `}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full shrink-0
                    ${t.type === 'APP_EXPENSE' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                  `}>
                                        {t.type === 'APP_EXPENSE' ? <Server size={20} /> : <HandHeart size={20} />}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${t.type === 'APP_EXPENSE' ? 'text-red-900' : 'text-blue-900'}`}>
                                            {t.title}
                                        </p>
                                        <p className={`text-xs ${t.type === 'APP_EXPENSE' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {t.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-1">
                                    <span className={`font-bold ${t.type === 'APP_EXPENSE' ? 'text-red-700' : 'text-blue-700'}`}>
                                        R$ {t.amount.toFixed(2)}
                                    </span>
                                    <button className={`flex items-center space-x-1 text-xs underline
                     ${t.type === 'APP_EXPENSE' ? 'text-red-500 hover:text-red-700' : 'text-blue-500 hover:text-blue-700'}
                  `}>
                                        <Download size={12} />
                                        <span>Comprovante</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}
