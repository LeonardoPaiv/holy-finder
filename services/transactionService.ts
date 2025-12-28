import { Transaction, PaginatedResult } from '../types';
import { api } from '@/lib/apiClient';

interface TransactionFilters {
  page?: number;
  limit?: number;
  donatorId?: string;
  category?: 'donation' | 'bill';
}

export const TransactionService = {
  getTransactions: async (filters: TransactionFilters = {}): Promise<PaginatedResult<Transaction>> => {
    const params = new URLSearchParams({
      page: (filters.page || 1).toString(),
      limit: (filters.limit || 10).toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value && !['page', 'limit'].includes(key)
        )
      )
    });

    const response = await api.get(`/api/transactions?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return await response.json();
  }
};
