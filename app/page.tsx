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
  const { religion, userLocation } = useApp();

  // Load data from services
  const fetchCompaniesData = async (lat: number, lng: number, radius?: number, limit?: number) => {
    try {
      const companiesData = await CompanyService.getCompanies(lat, lng, radius, limit);
      if (companiesData.length === 0) {
        toast('Nenhuma instituição encontrada nesta área.');
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
  }, [userLocation]);

  const handleSearchArea = async (center: { lat: number; lng: number }) => {
    await fetchCompaniesData(center.lat, center.lng, 5, 30);
  };

  return (
    <div className="w-full h-full">
      <MapView
        companies={companies}
        onSelectCompany={setSelectedCompany}
        currentReligion={religion}
        onSearchArea={handleSearchArea}
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
