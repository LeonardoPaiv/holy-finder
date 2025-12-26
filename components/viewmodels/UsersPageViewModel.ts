import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/apiClient';
import { PaginatedResult } from '@/types';
import { ModerationService } from '@/services/moderationService';
import { UserRole, UserType } from '@/lib/models/common';
import toast from 'react-hot-toast';
import { useInstitution } from '@/components/contexts/InstitutionContext';

export const useUsersPageViewModel = () => {
  const { user: currentUser } = useInstitution();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [userType, setUserType] = useState('');
  const [userRole, setUserRole] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (selectedUser) params.append('userId', selectedUser._id);
      if (selectedCompany) params.append('cnpj', selectedCompany._id);
      if (userType) params.append('type', userType);
      if (userRole) params.append('role', userRole);

      const response = await api.get(`/api/moderation/users?${params.toString()}`);

      if (response.ok) {
        const result: PaginatedResult<any> = await response.json();
        setUsers(result.data);
        setTotalPages(result.pagination.totalPages);
        setHasMore(result.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedUser, selectedCompany, userType, userRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setPage(1);
  };

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company);
    setPage(1);
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    setPage(1);
  };

  const handleUserRoleChange = (role: string) => {
    setUserRole(role);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedUser(null);
    setSelectedCompany(null);
    setUserType('');
    setUserRole('');
    setPage(1);
  };

  const handleUpdateUserRole = async (email: string, role: string) => {
    try {
      await ModerationService.updateUserRole(email, role as UserRole);
      toast.success('Role atualizada com sucesso!');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.message || 'Erro ao atualizar role');
    }
  };

  const handleUpdateUserType = async (email: string, type: string) => {
    try {
      await ModerationService.updateUserType(email, type as UserType);
      toast.success('Type atualizado com sucesso!');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user type:', error);
      toast.error(error.message || 'Erro ao atualizar type');
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const activeFiltersCount = [
    selectedUser !== null,
    selectedCompany !== null,
    userType !== '',
    userRole !== '',
  ].filter(Boolean).length;

  return {
    users,
    isLoading,
    page,
    totalPages,
    hasMore,
    selectedUser,
    selectedCompany,
    userType,
    userRole,
    activeFiltersCount,
    currentUserRole: currentUser?.role,
    handleUserSelect,
    handleCompanySelect,
    handleUserTypeChange,
    handleUserRoleChange,
    handleClearFilters,
    handleUpdateUserRole,
    handleUpdateUserType,
    handleNextPage,
    handlePrevPage,
    refetch: fetchUsers,
  };
};
