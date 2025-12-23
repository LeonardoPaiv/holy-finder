import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useSuspendPostDialogViewModel } from '../viewmodels/SuspendPostDialogViewModel';

interface SuspendPostDialogProps {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const SuspendPostDialog: React.FC<SuspendPostDialogProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const {
    isLoading,
    handleConfirm,
    handleClose,
  } = useSuspendPostDialogViewModel({ onConfirm, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Suspender Post</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 font-semibold mb-2">
              Você está prestes a suspender este post
            </p>
            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
              <li>O post será ocultado da plataforma</li>
              <li>Este ticket será marcado como resolvido</li>
              <li>Esta ação pode ser revertida posteriormente</li>
            </ul>
          </div>

          <p className="text-sm text-slate-600">
            Deseja continuar com a suspensão?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Suspendendo...
              </>
            ) : (
              'Suspender Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
