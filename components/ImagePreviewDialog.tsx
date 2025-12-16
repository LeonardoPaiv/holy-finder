import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null | undefined;
}

export const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[1100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 transition-colors"
        onClick={onClose}
        aria-label="Fechar visualização"
      >
        <X size={32} />
      </button>
      <img 
        src={imageUrl} 
        alt="Full Preview" 
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
