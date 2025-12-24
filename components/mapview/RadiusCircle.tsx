import React from 'react';
import { Circle } from 'react-leaflet';

interface RadiusCircleProps {
  userLocation: { lat: number; lng: number } | null;
  searchRadius: number;
  isAdjustingRadius: boolean;
}

export const RadiusCircle: React.FC<RadiusCircleProps> = ({ 
  userLocation, 
  searchRadius,
  isAdjustingRadius 
}) => {
  if (!userLocation || !isAdjustingRadius) return null;

  // Convert km to meters
  const radiusInMeters = searchRadius * 1000;

  return (
    <Circle
      center={[userLocation.lat, userLocation.lng]}
      radius={radiusInMeters}
      pathOptions={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.5,
      }}
    />
  );
};
