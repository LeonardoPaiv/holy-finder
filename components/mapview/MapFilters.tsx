import React from 'react';
import { Filter } from 'lucide-react';
import { useApp } from '../AppContext';
import { RecenterButton } from './RecenterButton';
import { Company } from '../../types';
import { CompanySearch } from './CompanySearch';

interface MapFiltersProps {
  currentReligion: string;
  onToggleSettings?: () => void;
  onSearchArea?: (center: { lat: number; lng: number }) => void;
  mapRef?: React.RefObject<any>;
  showRecenterButtom: boolean;
  onRecenter: () => void;
  onSelectCompany?: (company: Company) => void;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  currentReligion,
  onToggleSettings,
  onSearchArea,
  mapRef,
  showRecenterButtom,
  onRecenter,
  onSelectCompany,
}) => {
  const { searchRadius, setSearchRadius, userLocation, setIsAdjustingRadius, isLoadingCompanies } = useApp();

  const handleCompanySelect = (company: Company) => {
    if (onSelectCompany) {
      onSelectCompany(company);
    }
    
    if (mapRef?.current) {
      mapRef.current.flyTo(
        [company.geo.coordinates[1], company.geo.coordinates[0]], 
        16, 
        { duration: 1.5 }
      );
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[400] md:w-[400px] md:left-4 space-y-2 pointer-events-none">
      {/* Search Bar Component */}
      <CompanySearch 
        userLocation={userLocation}
        mapCenter={mapRef?.current?.getCenter()}
        onSelectCompany={handleCompanySelect}
      />

      {/* Religion Badge and Vertical Radius Slider */}
      <div className="flex flex-col gap-2 w-fit pointer-events-none">
        {/* Selected Religion Badge - Clickable */}
        <button
          type="button"
          onClick={onToggleSettings}
          className="w-fit bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-medium hover:bg-slate-800/90 active:bg-slate-700/90 transition-all cursor-pointer border-none outline-none pointer-events-auto"
          title="Clique para mudar a religião"
        >
          <Filter size={12} className="text-purple-300 flex-shrink-0" />
          <span className="whitespace-nowrap">Exibindo: <span className="text-purple-200">{currentReligion}</span></span>
        </button>

        {/* Vertical Radius Slider */}
        <div className="flex items-center w-fit pointer-events-none">
          <div className="flex flex-col items-center gap-1 pointer-events-auto">
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={searchRadius}
              onMouseDown={() => setIsAdjustingRadius(true)}
              onTouchStart={() => setIsAdjustingRadius(true)}
              onChange={(e) => {
                const newRadius = parseInt(e.target.value, 10);
                setSearchRadius(newRadius);
              }}
              onMouseUp={() => {
                setIsAdjustingRadius(false);
                if (onSearchArea && mapRef?.current) {
                  const center = mapRef.current.getCenter();
                  onSearchArea({ lat: center.lat, lng: center.lng });
                }
              }}
              onTouchEnd={() => {
                setIsAdjustingRadius(false);
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
            <RecenterButton show={showRecenterButtom} onRecenter={onRecenter} />
            
            {/* Loading Spinner */}
            {isLoadingCompanies && (
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                <svg 
                  className="animate-spin h-4 w-4 text-blue-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
