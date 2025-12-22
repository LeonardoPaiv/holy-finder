import { useState, useEffect } from 'react';
import { PostsReportsService, PostsReportsFilters } from '@/services/postsReportsService';
import { Company } from '@/types';
import toast from 'react-hot-toast';

export const usePostsReportsPageViewModel = () => {
  const [postsReports, setPostsReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [postId, setPostId] = useState('');

  const fetchPostsReports = async (currentPage: number = 1) => {
    setIsLoading(true);
    try {
      const filters: PostsReportsFilters = {};
      
      if (postId) {
        filters.postId = postId;
      } else {
        if (selectedCompany) filters.cnpj = selectedCompany._id;
        if (userId) filters.postCreator = userId;
        if (status) filters.status = status;
      }

      const result = await PostsReportsService.getPostsReports(filters, currentPage, 10);
      
      setPostsReports(result.data);
      setTotalPages(result.pagination.totalPages);
      setHasMore(result.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching posts reports:', error);
      toast.error('Erro ao carregar denúncias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsReports(page);
  }, [page, selectedCompany, userId, status, postId]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setPage(1);
  };

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePostIdChange = (value: string) => {
    setPostId(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCompany(null);
    setUserId('');
    setStatus('PENDING');
    setPostId('');
    setPage(1);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const activeFiltersCount = [selectedCompany, userId, postId].filter(Boolean).length;

  return {
    postsReports,
    isLoading,
    page,
    totalPages,
    hasMore,
    selectedCompany,
    userId,
    status,
    postId,
    activeFiltersCount,
    handleCompanySelect,
    handleUserIdChange,
    handleStatusChange,
    handlePostIdChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  };
};
