'use client';

import { useState, useEffect, type FC } from 'react';
import dynamic from 'next/dynamic';
import { Company } from '../types';
import { ChurchDialog } from '../components/ChurchDialog';
import { CompanyService } from '../services/companyService';
import { useApp } from '../components/AppContext';

const MapView = dynamic(() => import('../components/MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});

const App: FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { religion, userLocation } = useApp();

  // Load data from services
  useEffect(() => {
    const fetchData = async () => {
      if (userLocation) {
        const companiesData = await CompanyService.getCompanies(userLocation.lat, userLocation.lng);
        setCompanies(companiesData);
      } 
    };
    fetchData();
  }, [userLocation]);

  return (
    <div className="w-full h-full">
      <MapView
        companies={companies}
        onSelectCompany={setSelectedCompany}
        currentReligion={religion}
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
