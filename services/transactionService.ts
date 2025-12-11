import { Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        type: 'APP_EXPENSE',
        title: 'Servidores Google Cloud',
        amount: 150.00,
        date: '15/05/2024',
        receiptUrl: '#'
    },
    {
        id: '2',
        type: 'CHARITY_DONATION',
        title: 'Doação - Lar dos Velhinhos',
        amount: 500.00,
        date: '20/05/2024',
        receiptUrl: '#'
    },
    {
        id: '3',
        type: 'APP_EXPENSE',
        title: 'Manutenção de API',
        amount: 45.90,
        date: '22/05/2024',
        receiptUrl: '#'
    },
    {
        id: '4',
        type: 'CHARITY_DONATION',
        title: 'Doação - Casa do Menor',
        amount: 320.00,
        date: '25/05/2024',
        receiptUrl: '#'
    }
];

export const TransactionService = {
    getTransactions: async (): Promise<Transaction[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_TRANSACTIONS];
    }
};
