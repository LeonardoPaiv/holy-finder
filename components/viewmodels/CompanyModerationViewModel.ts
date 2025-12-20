import { useState, useEffect } from 'react';
import { Company, PaginatedResult } from '@/types';
import { CompanyService } from '@/services/companyService';
import { useConfirm } from '@/hooks/useConfirm';
import toast from 'react-hot-toast';

export const useCompanyModerationViewModel = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { confirm } = useConfirm();

  const fetchInactiveCompanies = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result: PaginatedResult<Company> = await CompanyService.getInactiveCompanies(
        page,
        pagination.limit
      );
      setCompanies(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching inactive companies:', error);
      toast.error('Erro ao carregar instituições inativas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveCompanies(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchInactiveCompanies(newPage);
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleToggleFromList = async (company: Company) => {
    const newStatus = !company.active;
    const message = newStatus
      ? `Tem certeza que deseja ATIVAR a instituição "${company.name}"?`
      : `Tem certeza que deseja DESATIVAR a instituição "${company.name}"?`;

    confirm(message, async () => {
      try {
        await CompanyService.toggleCompanyActive(company._id, newStatus);
        toast.success(
          newStatus
            ? 'Instituição ativada com sucesso!'
            : 'Instituição desativada com sucesso!'
        );
        fetchInactiveCompanies(pagination.page);
      } catch (error) {
        console.error('Error toggling company status:', error);
        toast.error('Erro ao alterar status da instituição.');
      }
    });
  };

  const handleStatusChanged = () => {
    fetchInactiveCompanies(pagination.page);
  };

  const handleSelectFromSearch = (company: Company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  return {
    companies,
    pagination,
    isLoading,
    selectedCompany,
    isDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleCloseDialog,
    handleToggleFromList,
    handleStatusChanged,
    handleSelectFromSearch,
  };
};
