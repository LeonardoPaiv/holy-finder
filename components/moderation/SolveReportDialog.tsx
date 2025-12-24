'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { BaseConfirmDialog } from './BaseConfirmDialog';

interface SolveReportDialogProps {
  isOpen: boolean;
  reportId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const SolveReportDialog: React.FC<SolveReportDialogProps> = ({
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
      title="Marcar como Resolvido"
      message={
        <>
          Você está prestes a marcar o report <span className="font-semibold">{reportId}</span> como resolvido.
        </>
      }
      confirmText="Resolver"
      loadingText="Resolvendo..."
      icon={Check}
      iconBgColor="bg-green-100"
      iconColor="text-green-600"
      confirmButtonColor="bg-green-500"
      confirmButtonHoverColor="hover:bg-green-600"
    />
  );
};
