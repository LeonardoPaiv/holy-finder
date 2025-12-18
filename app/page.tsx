'use client';

import { type FC } from 'react';
import dynamic from 'next/dynamic';
import { ChurchDialog } from '../components/ChurchDialog';
import { useAppViewModel } from '../components/viewmodels/AppViewModel';
import { useApp } from '@/components/AppContext';

const MapView = dynamic(() => import('../components/mapview/MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});

const App: FC = () => {
  const {
    selectedCompany,
    setSelectedCompany,
    mapCenter,
    companies,
    religion,
    handleSearchArea,
  } = useAppViewModel();

  const { setIsReligionDialogOpen } = useApp();

  return (
    <div className="w-full h-full">
      <MapView
        companies={companies}
        onSelectCompany={setSelectedCompany}
        currentReligion={religion}
        onSearchArea={handleSearchArea}
        center={mapCenter}
        onToggleSettings={() => setIsReligionDialogOpen(true)}
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
