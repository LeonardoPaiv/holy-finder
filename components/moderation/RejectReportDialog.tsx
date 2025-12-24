'use client';

import { X as XIcon, Loader2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error rejecting report:', error);
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
          <XIcon size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <AlertTriangle className="text-yellow-600" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Rejeitar Report</h2>
        
        <p className="text-gray-600 text-center mb-6">
          Você está prestes a rejeitar o report <span className="font-semibold">{reportId}</span>.
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
