import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { useApp } from '../AppContext';
import toast from 'react-hot-toast';

export const useMapViewViewModel = (
  center?: { lat: number; lng: number },
  onSearchArea?: (center: { lat: number; lng: number }) => void
) => {
  const { userLocation, setUserLocation } = useApp();
  const [lastSearchCenter, setLastSearchCenter] = useState<L.LatLng | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Calculate map position
  const position: [number, number] = useMemo(() => {
    if (center) return [center.lat, center.lng];
    const defaultPosition: [number, number] = [-23.550520, -46.633308];
    return userLocation ? [userLocation.lat, userLocation.lng] : defaultPosition;
  }, [userLocation, center]);

  // Initialize lastSearchCenter when userLocation is first available
  useEffect(() => {
    if (userLocation && !lastSearchCenter) {
      setLastSearchCenter(new L.LatLng(userLocation.lat, userLocation.lng));
    } else if (!userLocation && !lastSearchCenter) {
      setLastSearchCenter(new L.LatLng(-23.550520, -46.633308));
    }
  }, [userLocation, lastSearchCenter]);

  // Update lastSearchCenter when center prop changes (programmatic move)
  useEffect(() => {
    if (center) {
      setLastSearchCenter(new L.LatLng(center.lat, center.lng));
      setShowSearchButton(false);
    }
  }, [center]);

  // Auto-request geolocation on mount if not available
  useEffect(() => {
    if (!userLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setLastSearchCenter(new L.LatLng(newLocation.lat, newLocation.lng));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [userLocation, setUserLocation]);

  const handleManualLocationRequest = () => {
    if ("geolocation" in navigator) {
      toast.promise(
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(newLocation);
              setLastSearchCenter(new L.LatLng(newLocation.lat, newLocation.lng));
              resolve(newLocation);
            },
            (error) => {
              console.error("Error getting location:", error);
              reject(error);
            }
          );
        }),
        {
          loading: 'Obtendo sua localização...',
          success: 'Localização obtida com sucesso!',
          error: () => {
            return 'Não foi possível obter sua localização. Verifique as permissões do navegador.';
          },
        }
      );
    } else {
      toast.error("Geolocalização não é suportada neste navegador.");
    }
  };

  const handleRecenter = () => {
    if (userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setLastSearchCenter(new L.LatLng(newLocation.lat, newLocation.lng));
          setShowSearchButton(false);
        }
      );
    }
  };

  const handleMapMove = (center: L.LatLng) => {
    if (lastSearchCenter) {
      const distance = center.distanceTo(lastSearchCenter);
      // 5km threshold
      if (distance > 5000) {
        setShowSearchButton(true);
      } else {
        setShowSearchButton(false);
      }
    }
  };

  const handleSearchArea = () => {
    if (mapRef.current && onSearchArea) {
      const center = mapRef.current.getCenter();
      setLastSearchCenter(center);
      setShowSearchButton(false);
      onSearchArea({ lat: center.lat, lng: center.lng });
    } else if (mapRef.current) {
      // If no callback provided, just update the reference point to hide button
      const center = mapRef.current.getCenter();
      setLastSearchCenter(center);
      setShowSearchButton(false);
    }
  };

  return {
    position,
    userLocation,
    showSearchButton,
    mapRef,
    handleManualLocationRequest,
    handleRecenter,
    handleMapMove,
    handleSearchArea,
  };
};
