import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useFindNearest } from '../../hooks/useFindNearest';
import { CompanyService } from '../../services/companyService';
import toast from 'react-hot-toast';

export const useAppViewModel = () => {
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const { religion, userLocation, companies, setCompanies, searchRadius } = useApp();
  const { showFindNearestToast } = useFindNearest();

  const handleFindNearest = async () => {
    if (!userLocation) return;
    
    const toastId = toast.loading('Buscando instituição mais próxima...');
    try {
      const result = await CompanyService.getNearestCompanies(userLocation.lat, userLocation.lng, religion, 30);
      
      if (result.companies.length > 0) {
        setCompanies(result.companies);
        if (result.center) {
          setMapCenter(result.center);
        }
        toast.success('Instituições encontradas!', { id: toastId });
      } else {
        toast.error('Nenhuma instituição encontrada.', { id: toastId });
      }
    } catch (error) {
      console.error('Erro ao buscar próximas:', error);
      toast.error('Erro ao buscar instituições.', { id: toastId });
    }
  };

  const fetchCompaniesData = async (lat: number, lng: number, limit?: number) => {
    try {
      const companiesData = await CompanyService.getCompanies(lat, lng, searchRadius, limit, religion);
      if (companiesData.length === 0) {
        toast('Nenhuma instituição encontrada.');
      }
      setCompanies(companiesData);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      toast.error('Erro ao carregar instituições. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userLocation) {
        await fetchCompaniesData(userLocation.lat, userLocation.lng);
      }
    };
    fetchData();
  }, [userLocation, religion]);

  const handleSearchArea = async (center: { lat: number; lng: number }) => {
    // Reset map center to allow free movement after search
    setMapCenter(undefined);
    await fetchCompaniesData(center.lat, center.lng, 30);
  };

  return {
    selectedCompany,
    setSelectedCompany,
    mapCenter,
    companies,
    religion,
    handleSearchArea,
  };
};
