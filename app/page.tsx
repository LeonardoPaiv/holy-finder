'use client';

import { type FC } from 'react';
import { ChurchDialog } from '../components/ChurchDialog';
import { useAppViewModel } from '../components/viewmodels/AppViewModel';
import { MapView } from '@/components/MapView';
import { useApp } from '@/components/AppContext';

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
