import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types';
import { TransactionService } from '@/services/transactionService';
import toast from 'react-hot-toast';

export const useTransactionsPageViewModel = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadTransactions = async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await TransactionService.getTransactions({
        page: pageNum,
        limit: 10
      });

      if (append) {
        setTransactions(prev => [...prev, ...result.data]);
      } else {
        setTransactions(result.data);
      }

      setHasMore(result.pagination.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Erro ao carregar movimentações');
      toast.error('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await loadTransactions(page + 1, true);
    }
  };

  const handleRefresh = async () => {
    await loadTransactions(1, false);
  };

  const handleGoBack = () => {
    router.push('/donate');
  };

  // Load initial data (prevent double call in Strict Mode)
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadTransactions(1);
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    hasMore,
    handleLoadMore,
    handleRefresh,
    handleGoBack
  };
};
