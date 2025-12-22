import { useState, useEffect } from 'react';
import { PostsReportsService, PostsReportsFilters } from '@/services/postsReportsService';
import { Company } from '@/types';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  fullName: string;
  email: string;
}

export const usePostsReportsPageViewModel = () => {
  const [postsReports, setPostsReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
        if (selectedUser) filters.postCreator = selectedUser._id;
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
  }, [page, selectedCompany, selectedUser, status, postId]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setPage(1);
  };

  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
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
    setSelectedUser(null);
    setStatus('PENDING');
    setPostId('');
    setPage(1);
    fetchPostsReports();
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

  const activeFiltersCount = [selectedCompany, selectedUser, postId].filter(Boolean).length;

  return {
    postsReports,
    isLoading,
    page,
    totalPages,
    hasMore,
    selectedCompany,
    selectedUser,
    status,
    postId,
    activeFiltersCount,
    handleCompanySelect,
    handleUserSelect,
    handleStatusChange,
    handlePostIdChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  };
};
