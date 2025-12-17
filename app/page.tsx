'use client';

import { useState, useEffect, type FC } from 'react';
import dynamic from 'next/dynamic';
import { Company } from '../types';
import { ChurchDialog } from '../components/ChurchDialog';
import { CompanyService } from '../services/companyService';
import { useApp } from '../components/AppContext';
import toast from 'react-hot-toast';

const MapView = dynamic(() => import('../components/MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});

const App: FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const { religion, userLocation } = useApp();

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

  const FindNearestToast = ({ t }: { t: any }) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Nenhuma instituição encontrada nesta área
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Deseja buscar a instituição mais próxima da sua localização atual?
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            handleFindNearest();
          }}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Buscar Próxima
        </button>
      </div>
    </div>
  );

  // Load data from services
  const fetchCompaniesData = async (lat: number, lng: number, radius?: number, limit?: number) => {
    try {
      const companiesData = await CompanyService.getCompanies(lat, lng, radius, limit, religion);
      if (companiesData.length === 0 && radius) {
        toast.custom((t) => <FindNearestToast t={t} />, { duration: 5000 });
      } else if (companiesData.length === 0) {
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
        await fetchCompaniesData(userLocation.lat, userLocation.lng, 5);
      }
    };
    fetchData();
  }, [userLocation, religion]);

  const handleSearchArea = async (center: { lat: number; lng: number }) => {
    // Reset map center to allow free movement after search
    setMapCenter(undefined);
    await fetchCompaniesData(center.lat, center.lng, 5, 30);
  };

  return (
    <div className="w-full h-full">
      <MapView
        companies={companies}
        onSelectCompany={setSelectedCompany}
        currentReligion={religion}
        onSearchArea={handleSearchArea}
        center={mapCenter}
      />

      {/* Global Dialogs */}
      <ChurchDialog
        church={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
};

export default App;
