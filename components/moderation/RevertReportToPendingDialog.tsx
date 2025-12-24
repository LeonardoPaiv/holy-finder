'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { BaseConfirmDialog } from './BaseConfirmDialog';

interface RevertReportToPendingDialogProps {
  isOpen: boolean;
  reportId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const RevertReportToPendingDialog: React.FC<RevertReportToPendingDialogProps> = ({
  isOpen,
  reportId,
  onConfirm,
  onClose,
}) => {
  return (
    <BaseConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Voltar para Pendente"
      message={
        <>
          Você está prestes a reverter o report <span className="font-semibold">{reportId}</span> para o estado pendente.
        </>
      }
      confirmText={
        <span className="flex items-center gap-2">
          <RotateCcw size={18} />
          Confirmar
        </span>
      }
      loadingText="Revertendo..."
      icon={RotateCcw}
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
      confirmButtonColor="bg-blue-500"
      confirmButtonHoverColor="hover:bg-blue-600"
    />
  );
};
