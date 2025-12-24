'use client';

import React from 'react';
import { AlertTriangle, Crown, ArrowRight } from 'lucide-react';
import { BaseConfirmDialog } from '@/components/moderation/BaseConfirmDialog';

interface TransferOwnershipDialogProps {
  isOpen: boolean;
  newOwnerName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const TransferOwnershipDialog: React.FC<TransferOwnershipDialogProps> = ({
  isOpen,
  newOwnerName,
  onConfirm,
  onClose,
}) => {
  return (
    <BaseConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Transferir Propriedade"
      message={
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-2">Atenção: Esta ação é irreversível!</p>
                <p>
                  Ao confirmar, você <strong>deixará de ser o proprietário</strong> desta instituição e 
                  será rebaixado para <strong>Admin da Instituição</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            <div className="flex items-center gap-2 text-slate-600">
              <Crown size={20} className="text-yellow-600" />
              <span className="font-medium">Você</span>
            </div>
            <ArrowRight size={20} className="text-slate-400" />
            <div className="flex items-center gap-2 text-slate-600">
              <Crown size={20} className="text-yellow-600" />
              <span className="font-medium">{newOwnerName}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center">
            <strong>{newOwnerName}</strong> se tornará o novo proprietário e terá controle total 
            sobre a instituição, incluindo a capacidade de transferir a propriedade novamente.
          </p>
        </div>
      }
      confirmText="Transferir Propriedade"
      cancelText="Cancelar"
      loadingText="Transferindo..."
      icon={Crown}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-600"
      confirmButtonColor="bg-orange-600"
      confirmButtonHoverColor="hover:bg-orange-700"
    />
  );
};
