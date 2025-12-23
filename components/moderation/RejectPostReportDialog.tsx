'use client';

import { useRejectPostReportDialogViewModel } from '@/components/viewmodels/RejectPostReportDialogViewModel';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface RejectPostReportDialogProps {
  isOpen: boolean;
  postId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const RejectPostReportDialog = ({
  isOpen,
  postId,
  onConfirm,
  onClose,
}: RejectPostReportDialogProps) => {
  const { isLoading, handleConfirm, handleClose } = useRejectPostReportDialogViewModel({
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
          <div className="bg-yellow-100 rounded-full p-3">
            <AlertTriangle className="text-yellow-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Rejeitar Denúncia
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          Você está prestes a rejeitar a denúncia do post <span className="font-semibold">{postId}</span>.
          Esta ação marcará a denúncia como rejeitada.
        </p>

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
            className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Rejeitando...
              </>
            ) : (
              'Rejeitar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
