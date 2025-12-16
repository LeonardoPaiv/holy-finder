import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Save, X, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationEditorProps {
  initialCoordinates: [number, number];
  initialMapsUrl?: string;
  onSaveLocation: (coordinates: [number, number]) => Promise<void>;
  onSaveMapsUrl: (url: string) => Promise<void>;
  isSaving: boolean;
}

const LocationMarker = ({ position, onPositionChange }: { position: L.LatLng, onPositionChange: (latlng: L.LatLng) => void }) => {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onPositionChange(position);
        },
      }}
    />
  );
};

export const LocationEditor: React.FC<LocationEditorProps> = ({
  initialCoordinates,
  initialMapsUrl,
  onSaveLocation,
  onSaveMapsUrl,
  isSaving
}) => {
  // Ensure we have valid coordinates, default to Sao Paulo if not
  const defaultCoords: [number, number] = [-23.550520, -46.633308];
  const validInitialCoords = initialCoordinates && initialCoordinates.length === 2 
    ? initialCoordinates 
    : defaultCoords;

  // Leaflet uses [lat, lng], but our DB might store [lng, lat] (GeoJSON). 
  // Assuming initialCoordinates passed here are [lng, lat] from GeoJSON, we need to flip for Leaflet [lat, lng].
  // Wait, the prop says initialCoordinates: [number, number]. Let's verify what is passed.
  // In Company model: geo: { type: 'Point', coordinates: [lng, lat] }
  // So we receive [lng, lat]. Leaflet needs [lat, lng].
  
  const [markerPosition, setMarkerPosition] = useState<L.LatLng>(
    new L.LatLng(validInitialCoords[1], validInitialCoords[0])
  );
  
  const [originalPosition, setOriginalPosition] = useState<L.LatLng>(
    new L.LatLng(validInitialCoords[1], validInitialCoords[0])
  );

  const [hasMoved, setHasMoved] = useState(false);
  const [mapsUrl, setMapsUrl] = useState(initialMapsUrl || '');
  const [originalMapsUrl, setOriginalMapsUrl] = useState(initialMapsUrl || '');

  useEffect(() => {
    if (initialCoordinates && initialCoordinates.length === 2) {
        const newPos = new L.LatLng(initialCoordinates[1], initialCoordinates[0]);
        setMarkerPosition(newPos);
        setOriginalPosition(newPos);
        setHasMoved(false);
    }
  }, [initialCoordinates]);

  useEffect(() => {
      setMapsUrl(initialMapsUrl || '');
      setOriginalMapsUrl(initialMapsUrl || '');
  }, [initialMapsUrl]);

  const handlePositionChange = (latlng: L.LatLng) => {
    setMarkerPosition(latlng);
    setHasMoved(true);
  };

  const handleCancelMove = () => {
    setMarkerPosition(originalPosition);
    setHasMoved(false);
  };

  const handleSaveLocation = async () => {
    // Save as [lng, lat]
    await onSaveLocation([markerPosition.lng, markerPosition.lat]);
    setOriginalPosition(markerPosition);
    setHasMoved(false);
  };

  const handleSaveMapsUrl = async () => {
      await onSaveMapsUrl(mapsUrl);
      setOriginalMapsUrl(mapsUrl);
  };

  const hasUrlChanged = mapsUrl !== originalMapsUrl;

  return (
    <div className="space-y-8">
      {/* Map Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 min-h-[40px]">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                <span className="hidden md:inline">Localização no Mapa</span>
                <span className="md:hidden">Localização</span>
            </h3>
            {hasMoved && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <button
                        onClick={handleCancelMove}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <X size={16} />
                        <span className="hidden md:inline">Cancelar</span>
                    </button>
                    <button
                        onClick={handleSaveLocation}
                        disabled={isSaving}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span className="hidden md:inline">Definir Localização</span>
                        <span className="md:hidden">Salvar</span>
                    </button>
                </div>
            )}
        </div>
        
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
            <MapContainer
                center={[originalPosition.lat, originalPosition.lng]}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker position={markerPosition} onPositionChange={handlePositionChange} />
            </MapContainer>
        </div>
        <p className="mt-3 text-sm text-slate-500">
            Clique no mapa ou arraste o marcador para ajustar a localização exata da sua instituição.
        </p>
      </div>

      {/* Google Maps URL Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ExternalLink className="text-blue-600" size={20} />
            Link Dedicado do Google Maps
        </h3>
        
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
                <p className="mb-2 font-semibold">Por que adicionar um link dedicado?</p>
                <p>
                    Por padrão, abrimos a localização usando apenas as coordenadas (latitude e longitude). 
                    Ao fornecer o link de compartilhamento do Google Maps, os usuários verão todas as informações da sua instituição (fotos, avaliações, horários) diretamente no app do Google Maps.
                </p>
            </div>

            <div className="flex gap-3">
                <input
                    type="text"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    placeholder="Cole aqui o link de compartilhamento (ex: https://maps.app.goo.gl/...)"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {hasUrlChanged && (
                    <>
                        <button
                            onClick={() => setMapsUrl(originalMapsUrl)}
                            disabled={isSaving}
                            className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Cancelar alteração"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleSaveMapsUrl}
                            disabled={isSaving}
                            className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            <span className="hidden md:inline">Salvar Link</span>
                            <span className="md:hidden">Salvar</span>
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
