import { useState } from 'react';
import { Company } from '@/types';
import { CompanyService } from '@/services/companyService';
import { useConfirm } from '@/hooks/useConfirm';
import toast from 'react-hot-toast';

export const useCompanyModerationDialogViewModel = (
  company: Company | null,
  onClose: () => void,
  onStatusChanged?: () => void
) => {
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [localCompany, setLocalCompany] = useState<Company | null>(company);
  const { confirm } = useConfirm();

  const handleToggleStatus = async () => {
    if (!localCompany) return;

    const newStatus = !localCompany.active;
    const message = newStatus
      ? `Tem certeza que deseja ATIVAR a instituição "${localCompany.name}"?`
      : `Tem certeza que deseja DESATIVAR a instituição "${localCompany.name}"?`;

    confirm(message, async () => {
      setIsTogglingStatus(true);
      try {
        const updatedCompany = await CompanyService.toggleCompanyActive(
          localCompany._id,
          newStatus
        );
        setLocalCompany(updatedCompany);
        toast.success(
          newStatus
            ? 'Instituição ativada com sucesso!'
            : 'Instituição desativada com sucesso!'
        );
        onStatusChanged?.();
      } catch (error) {
        console.error('Error toggling company status:', error);
        toast.error('Erro ao alterar status da instituição.');
      } finally {
        setIsTogglingStatus(false);
      }
    });
  };

  return {
    localCompany,
    isTogglingStatus,
    handleToggleStatus,
    handleClose: onClose,
  };
};
