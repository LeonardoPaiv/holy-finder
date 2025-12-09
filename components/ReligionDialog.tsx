import React from 'react';
import { X, Check, Star } from 'lucide-react';

interface ReligionDialogProps {
  isOpen: boolean;
  currentReligion: string;
  onSelect: (religion: string) => void;
  onClose: () => void;
}

const RELIGIONS = [
  'Católica',
  'Evangélica',
  'Espírita',
  'Matriz Africana',
  'Judaica',
  'Budista',
  'Muçulmana',
  'Outras'
];

export const ReligionDialog: React.FC<ReligionDialogProps> = ({ 
  isOpen, 
  currentReligion, 
  onSelect, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
              <Star size={18} fill="currentColor" />
            </div>
            <h2 className="font-bold text-slate-800">Selecione a Religião</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-2 overflow-y-auto max-h-[60vh]">
          <div className="space-y-1">
            {RELIGIONS.map((religion) => {
              const isSelected = currentReligion === religion;
              return (
                <button
                  key={religion}
                  onClick={() => {
                    onSelect(religion);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all
                    ${isSelected 
                      ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'}
                  `}
                >
                  <span className={`font-medium ${isSelected ? 'font-bold' : ''}`}>
                    {religion}
                  </span>
                  {isSelected && (
                    <div className="bg-purple-600 text-white p-1 rounded-full">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Isso filtrará os locais exibidos no mapa.
          </p>
        </div>
      </div>
    </div>
  );
};
