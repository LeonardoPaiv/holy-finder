'use client';

import React from 'react';
import { MapPin, Filter, Navigation } from 'lucide-react';
import { useApp } from '../AppContext';

interface MapFiltersProps {
  currentReligion: string;
  onToggleSettings?: () => void;
  onSearchArea?: (center: { lat: number; lng: number }) => void;
  mapRef?: React.RefObject<any>;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  currentReligion,
  onToggleSettings,
  onSearchArea,
  mapRef,
}) => {
  const { searchRadius, setSearchRadius } = useApp();

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

      {/* Religion Badge and Vertical Radius Slider */}
      <div className="flex flex-col gap-2">
        {/* Selected Religion Badge - Clickable */}
        <button
          type="button"
          onClick={onToggleSettings}
          className="w-fit bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-medium hover:bg-slate-800/90 active:bg-slate-700/90 transition-all cursor-pointer border-none outline-none"
          title="Clique para mudar a religião"
        >
          <Filter size={12} className="text-purple-300 flex-shrink-0" />
          <span className="whitespace-nowrap">Exibindo: <span className="text-purple-200">{currentReligion}</span></span>
        </button>

        {/* Vertical Radius Slider */}
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-blue-600 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md" title={`${searchRadius}km`}>
              <Navigation size={14} />
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={searchRadius}
              onChange={(e) => {
                const newRadius = parseInt(e.target.value, 10);
                setSearchRadius(newRadius);
              }}
              onMouseUp={() => {
                // Trigger search when user releases the slider
                if (onSearchArea && mapRef?.current) {
                  const center = mapRef.current.getCenter();
                  onSearchArea({ lat: center.lat, lng: center.lng });
                }
              }}
              onTouchEnd={() => {
                // Trigger search on mobile when user releases
                if (onSearchArea && mapRef?.current) {
                  const center = mapRef.current.getCenter();
                  onSearchArea({ lat: center.lat, lng: center.lng });
                }
              }}
              className="h-24 w-2 bg-slate-200/90 backdrop-blur-sm rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-md [writing-mode:bt-lr]"
              style={{
                WebkitAppearance: 'slider-vertical',
              } as React.CSSProperties}
            />
            <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
              {searchRadius}km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
