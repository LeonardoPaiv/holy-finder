import React from 'react';
import { MapPin, Filter } from 'lucide-react';

interface FloatingSearchBarProps {
  currentReligion: string;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ currentReligion }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-[400] md:w-[400px] md:left-4 space-y-2">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-3 flex items-center space-x-3 border border-slate-200">
        <MapPin className="text-blue-600" size={20} />
        <input 
          type="text" 
          placeholder="Buscar paróquia ou bairro..." 
          className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500 font-medium"
        />
      </div>

      {/* Selected Religion Badge */}
      <div className="flex justify-start">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-md flex items-center space-x-2 text-xs font-medium animate-in slide-in-from-top-2">
          <Filter size={12} className="text-purple-300" />
          <span>Exibindo: <span className="text-purple-200">{currentReligion}</span></span>
        </div>
      </div>
    </div>
  );
};
