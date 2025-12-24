import { useState, useEffect, useCallback } from 'react';
import { CompanyService } from '@/services/companyService';
import { User, UserType } from '@/types';
import toast from 'react-hot-toast';

interface UseUserControlViewModelProps {
  institutionId: string | undefined;
  currentUser: User | null;
}

export const useUserControlViewModel = ({ institutionId, currentUser }: UseUserControlViewModelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [showOwnershipDialog, setShowOwnershipDialog] = useState(false);
  const [pendingOwnerTransfer, setPendingOwnerTransfer] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!institutionId) return;
    
    setIsLoading(true);
    try {
      const data = await CompanyService.getCompanyUsers(institutionId);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários.');
    } finally {
      setIsLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTypeChange = async (userId: string, newType: UserType) => {
    if (!institutionId) return;

    // Check if changing to owner
    if (newType === 'institution owner') {
      const targetUser = users.find(u => u._id === userId);
      if (targetUser) {
        setPendingOwnerTransfer({
          userId,
          userName: targetUser.fullName,
        });
        setShowOwnershipDialog(true);
        return;
      }
    }

    // Normal type change
    await executeTypeChange(userId, newType);
  };

  const executeTypeChange = async (userId: string, newType: UserType) => {
    if (!institutionId) return;
    
    setUpdatingUserId(userId);
    try {
      await CompanyService.updateCompanyUserRole(institutionId, userId, newType);
      setUsers(users.map(u => u._id === userId ? { ...u, type: newType } : u));
      toast.success('Permissão atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar permissão.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const confirmOwnershipTransfer = async () => {
    if (!institutionId || !pendingOwnerTransfer || !currentUser) return;

    setUpdatingUserId(pendingOwnerTransfer.userId);
    try {
      await CompanyService.updateCompanyUserRole(
        institutionId, 
        pendingOwnerTransfer.userId, 
        'institution owner'
      );
      
      // Update local state
      setUsers(users.map(u => {
        if (u._id === currentUser._id) {
          return { ...u, type: 'institution admin' as UserType };
        }
        if (u._id === pendingOwnerTransfer.userId) {
          return { ...u, type: 'institution owner' as UserType };
        }
        return u;
      }));

      toast.success('Propriedade transferida com sucesso!');
      setShowOwnershipDialog(false);
      setPendingOwnerTransfer(null);
    } catch (error) {
      console.error('Error transferring ownership:', error);
      toast.error('Erro ao transferir propriedade.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const cancelOwnershipTransfer = () => {
    setShowOwnershipDialog(false);
    setPendingOwnerTransfer(null);
  };

  const isCurrentUserOwner = currentUser?.type === 'institution owner';

  return {
    users,
    isLoading,
    updatingUserId,
    showOwnershipDialog,
    pendingOwnerTransfer,
    isCurrentUserOwner,
    currentUser,
    handleTypeChange,
    confirmOwnershipTransfer,
    cancelOwnershipTransfer,
    refetch: fetchUsers,
  };
};
