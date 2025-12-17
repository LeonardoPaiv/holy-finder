import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SearchAreaButtonProps {
  show: boolean;
  onSearch: () => void;
}

export const SearchAreaButton: React.FC<SearchAreaButtonProps> = ({ show, onSearch }) => {
  if (!show) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[400] animate-in fade-in slide-in-from-top-4 duration-300">
      <button 
        onClick={onSearch}
        className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center space-x-2 hover:bg-blue-50 transition-colors border border-blue-100"
      >
        <RefreshCw size={16} />
        <span>Pesquisar nesta área</span>
      </button>
    </div>
  );
};
