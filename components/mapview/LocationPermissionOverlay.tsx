import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPermissionOverlayProps {
  onRequestLocation: () => void;
}

export const LocationPermissionOverlay: React.FC<LocationPermissionOverlayProps> = ({ onRequestLocation }) => {
  return (
    <div className="absolute inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <MapPin size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Ative sua Localização</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Para encontrar paróquias e eventos próximos a você, precisamos acesso à sua localização.
          </p>
        </div>
        <button 
          onClick={onRequestLocation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          Ativar Localização
        </button>
      </div>
    </div>
  );
};
