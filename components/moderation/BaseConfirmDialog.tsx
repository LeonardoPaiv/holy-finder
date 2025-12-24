'use client';

import React, { useState } from 'react';
import { X, Loader2, LucideIcon } from 'lucide-react';

interface BaseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string | React.ReactNode;
  cancelText?: string;
  loadingText?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  confirmButtonColor?: string;
  confirmButtonHoverColor?: string;
}

export const BaseConfirmDialog: React.FC<BaseConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loadingText = 'Processando...',
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  confirmButtonColor = 'bg-blue-500',
  confirmButtonHoverColor = 'hover:bg-blue-600',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirmation:', error);
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
          <div className={`${iconBgColor} rounded-full p-3`}>
            <Icon className={iconColor} size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        
        <div className="text-gray-600 text-center mb-6">
          {message}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 ${confirmButtonColor} text-white rounded-xl font-medium ${confirmButtonHoverColor} transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
