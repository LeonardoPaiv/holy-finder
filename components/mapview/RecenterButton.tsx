import React from 'react';
import { Navigation } from 'lucide-react';

interface RecenterButtonProps {
  show: boolean;
  onRecenter: () => void;
}

export const RecenterButton: React.FC<RecenterButtonProps> = ({ show, onRecenter }) => {
  if (!show) return null;

  return (
    <button 
      onClick={onRecenter}
      className="w-fit z-[400] bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <Navigation size={24} className="text-blue-600" />
    </button>
  );
};
