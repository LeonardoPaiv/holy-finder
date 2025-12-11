'use client';

import { useState, useEffect, type FC } from 'react';
import dynamic from 'next/dynamic';
import { Church } from '../types';
import { ChurchDialog } from '../components/ChurchDialog';
import { ChurchService } from '../services/churchService';
import { useApp } from '../components/AppContext';

const MapView = dynamic(() => import('../components/MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});

const App: FC = () => {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [churches, setChurches] = useState<Church[]>([]);
  const { religion } = useApp();

  // Load data from services
  useEffect(() => {
    const fetchData = async () => {
      const churchesData = await ChurchService.getChurches();
      setChurches(churchesData);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <MapView
        churches={churches}
        onSelectChurch={setSelectedChurch}
        currentReligion={religion}
      />

      {/* Global Dialogs */}
      <ChurchDialog
        church={selectedChurch}
        onClose={() => setSelectedChurch(null)}
      />
    </div>
  );
};

export default App;
