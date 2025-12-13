import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Church } from '../types';
import { MapPin, Filter, Navigation } from 'lucide-react';
import { useApp } from './AppContext';

// Custom Marker Icon using DivIcon and Tailwind classes
const customMarkerIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `
    <div class="relative flex flex-col items-center justify-center transform hover:scale-110 transition-transform duration-200 cursor-pointer">
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
      <div class="relative flex items-center justify-center">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

interface MapViewProps {
  churches: Church[];
  onSelectChurch: (church: Church) => void;
  currentReligion: string;
}

// Component to handle map resizing and centering
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
      if (center) {
          map.flyTo(center, map.getZoom());
      }
  }, [center, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ churches, onSelectChurch, currentReligion }) => {
  const { userLocation, setUserLocation } = useApp();
  // Default to São Paulo if no location
  const defaultPosition: [number, number] = [-23.550520, -46.633308];
  const position: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultPosition;

  useEffect(() => {
      if (!userLocation && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setUserLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  });
              },
              (error) => {
                  console.error("Error getting location:", error);
              }
          );
      }
  }, [userLocation, setUserLocation]);

  const handleRecenter = () => {
      if (userLocation) {
           // If we already have location, just trigger a re-render or similar (handled by MapController via prop)
           // But actually, MapController updates when 'position' changes.
           // If we want to force re-center on button click even if position hasn't changed, we might need a way to signal it.
           // For now, let's just re-fetch location to be sure.
           navigator.geolocation.getCurrentPosition(
              (position) => {
                  setUserLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  });
              }
           );
      }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-100">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapController center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
        )}

        {churches.map((church) => (
          <Marker 
            key={church.id} 
            position={[church.lat, church.lng]} 
            icon={customMarkerIcon}
            eventHandlers={{
              click: () => onSelectChurch(church),
            }}
          >
          </Marker>
        ))}
      </MapContainer>
      
      {/* Floating search bar and Religion Badge */}
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

      {/* Recenter Button */}
      <button 
        onClick={handleRecenter}
        className="absolute bottom-24 right-4 z-[400] bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Navigation size={24} className={userLocation ? "text-blue-600" : "text-slate-400"} />
      </button>
    </div>
  );
};