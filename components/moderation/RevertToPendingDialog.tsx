'use client';

import { useRevertToPendingDialogViewModel } from '@/components/viewmodels/RevertToPendingDialogViewModel';
import { X, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

interface RevertToPendingDialogProps {
  isOpen: boolean;
  postId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const RevertToPendingDialog = ({
  isOpen,
  postId,
  onConfirm,
  onClose,
}: RevertToPendingDialogProps) => {
  const { isLoading, handleConfirm, handleClose } = useRevertToPendingDialogViewModel({
    onConfirm,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <RotateCcw className="text-blue-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Voltar para Pendente
        </h2>

        {/* Description */}
        <div className="space-y-3 mb-6">
          <p className="text-gray-600 text-center">
            Você está prestes a reverter a denúncia do post <span className="font-semibold">{postId}</span> para o estado pendente.
          </p>
          
          {/* Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Esta ação irá:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Remover a suspensão do post</li>
                  <li>Alterar o status da denúncia para PENDENTE</li>
                </ul>
                <p className="font-semibold mt-2 text-amber-900">
                  ⚠️ Não irá desbanir o usuário (se banido)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Revertendo...
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
