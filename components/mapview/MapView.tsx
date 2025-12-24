import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Company } from '../../types';
import { useMapViewViewModel } from '../viewmodels/MapViewViewModel';
import { useApp } from '../AppContext';
import { MapController } from './MapController';
import { MapEvents } from './MapEvents';
import { LocationPermissionOverlay } from './LocationPermissionOverlay';
import { SearchAreaButton } from './SearchAreaButton';
import { MapFilters } from './MapFilters';
import { RecenterButton } from './RecenterButton';
import { RadiusCircle } from './RadiusCircle';

// Custom Marker Icon using DivIcon and Tailwind classes
const customMarkerIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `
    <div class="marker-fade-in relative flex flex-col items-center justify-center transform hover:scale-110 transition-transform duration-200 cursor-pointer">
      <div class="w-10 h-10 bg-blue-600 rounded-full shadow-xl border-2 border-white flex items-center justify-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="w-3 h-3 bg-blue-600 rotate-45 -mt-2 shadow-sm"></div>
      <div class="w-8 h-2 bg-black/20 blur-[2px] rounded-full mt-0.5"></div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
});

// User Location Marker
const userLocationIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `
    <div class="marker-fade-in relative flex items-center justify-center">
      <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"></div>
      <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapViewProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  currentReligion: string;
  onSearchArea?: (center: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
  onToggleSettings?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ 
  companies, 
  onSelectCompany, 
  currentReligion, 
  onSearchArea, 
  center,
  onToggleSettings
}) => {
  const {
    position,
    zoom,
    userLocation,
    showSearchButton,
    mapRef,
    handleManualLocationRequest,
    handleRecenter,
    handleMapMove,
    handleSearchArea,
  } = useMapViewViewModel(center, onSearchArea);

  const { searchRadius, isAdjustingRadius } = useApp();

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-100">
      <MapContainer 
        center={position} 
        zoom={zoom}
        key={`map-${zoom}`}
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <MapController center={position} />
        <MapEvents onMoveEnd={handleMapMove} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
            <RadiusCircle userLocation={userLocation} searchRadius={searchRadius} isAdjustingRadius={isAdjustingRadius} />
          </>
        )}

        {companies.map((company) => (
          <Marker 
            key={company._id} 
            position={[company.geo.coordinates[1], company.geo.coordinates[0]]} 
            icon={customMarkerIcon}
            eventHandlers={{
              click: () => onSelectCompany(company),
            }}
          >
          </Marker>
        ))}
      </MapContainer>
      
      <SearchAreaButton show={showSearchButton} onSearch={handleSearchArea} />
      
      {!userLocation && (
        <LocationPermissionOverlay onRequestLocation={handleManualLocationRequest} />
      )}
      
      <MapFilters 
        currentReligion={currentReligion}
        onToggleSettings={onToggleSettings}
        onSearchArea={onSearchArea}
        mapRef={mapRef}
        showRecenterButtom={!!userLocation}
        onRecenter={handleRecenter}
        onSelectCompany={onSelectCompany}
      />
    </div>
  );
};
