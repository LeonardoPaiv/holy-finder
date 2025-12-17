import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MapEventsProps {
  onMoveEnd: (center: L.LatLng) => void;
}

export const MapEvents: React.FC<MapEventsProps> = ({ onMoveEnd }) => {
  useMapEvents({
    moveend: (e) => {
      onMoveEnd(e.target.getCenter());
    },
  });
  
  return null;
};
