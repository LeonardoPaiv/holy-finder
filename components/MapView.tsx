import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Church } from '../types';
import { MapPin, Filter } from 'lucide-react';

// Fix for default Leaflet icons in React
const iconPerson = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  churches: Church[];
  onSelectChurch: (church: Church) => void;
  currentReligion: string;
}

// Component to handle map resizing when container changes
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ churches, onSelectChurch, currentReligion }) => {
  // Center roughly on São Paulo for demo purposes, or use geolocation
  const [position] = useState<[number, number]>([-23.550520, -46.633308]);

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-100">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {churches.map((church) => (
          <Marker 
            key={church.id} 
            position={[church.lat, church.lng]} 
            icon={iconPerson}
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
    </div>
  );
};