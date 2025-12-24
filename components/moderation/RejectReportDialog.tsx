'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseConfirmDialog } from './BaseConfirmDialog';

interface RejectReportDialogProps {
  isOpen: boolean;
  reportId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const RejectReportDialog: React.FC<RejectReportDialogProps> = ({
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
      title="Rejeitar Report"
      message={
        <>
          Você está prestes a rejeitar o report <span className="font-semibold">{reportId}</span>.
        </>
      }
      confirmText="Rejeitar"
      loadingText="Rejeitando..."
      icon={AlertTriangle}
      iconBgColor="bg-yellow-100"
      iconColor="text-yellow-600"
      confirmButtonColor="bg-yellow-500"
      confirmButtonHoverColor="hover:bg-yellow-600"
    />
  );
};
