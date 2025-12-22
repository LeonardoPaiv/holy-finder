import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useBanUserDialogViewModel } from '../viewmodels/BanUserDialogViewModel';

interface BanUserDialogProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const BanUserDialog: React.FC<BanUserDialogProps> = ({
  isOpen,
  userName,
  onConfirm,
  onClose,
}) => {
  const {
    confirmText,
    setConfirmText,
    isLoading,
    isConfirmValid,
    handleConfirm,
    handleClose,
  } = useBanUserDialogViewModel({ userName, onConfirm, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Banir Usuário</h2>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">
              ⚠️ Esta ação é severa e irreversível!
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Todos os posts de <strong>{userName}</strong> serão desabilitados</li>
              <li>Todos os tickets relacionados serão marcados como resolvidos</li>
              <li>O usuário não poderá mais acessar a plataforma</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Digite <strong className="text-red-600">BANIR</strong> para confirmar:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite BANIR"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>
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
            disabled={!isConfirmValid || isLoading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Banindo...
              </>
            ) : (
              'Banir Usuário'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
