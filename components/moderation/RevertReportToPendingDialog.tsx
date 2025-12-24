'use client';

import { RotateCcw, Loader2, X } from 'lucide-react';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error reverting report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <RotateCcw className="text-blue-600" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Voltar para Pendente</h2>
        
        <p className="text-gray-600 text-center mb-6">
          Você está prestes a reverter o report <span className="font-semibold">{reportId}</span> para o estado pendente.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
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
