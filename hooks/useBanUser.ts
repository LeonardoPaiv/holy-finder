import { useState } from 'react';
import { UserService } from '@/services/userService';

interface UseBanUserProps {
  onSuccess?: () => void;
}

export const useBanUser = ({ onSuccess }: UseBanUserProps = {}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    email: string;
    fullName: string;
  } | null>(null);

  const openBanDialog = (user: { email: string; fullName: string }) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeBanDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmBan = async () => {
    if (!selectedUser) return;

    await UserService.banUser(selectedUser.email);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    isDialogOpen,
    selectedUser,
    openBanDialog,
    closeBanDialog,
    confirmBan,
  };
};
