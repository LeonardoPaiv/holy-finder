'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Company } from '@/types';
import { CompanyService } from '@/services/companyService';
import dynamic from 'next/dynamic';

const MapView = dynamic(
  () => import('@/components/mapview/MapView').then((mod) => mod.MapView),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Carregando mapa...</p>
      </div>
    )
  }
);
import { ChurchDialog } from '@/components/ChurchDialog';

export default function CompanyMapPage() {
  const params = useParams();
  const router = useRouter();
  const cnpj = params.cnpj as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompany = async () => {
      if (!cnpj) return;
      
      try {
        setLoading(true);
        const companyData = await CompanyService.getCompanyByCnpj(cnpj);
        setCompany(companyData);
      } catch (error) {
        console.error('Error loading company:', error);
        // Redirect to home if company not found
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [cnpj, router]);

  const handleClose = () => {
    router.push('/');
  };

  if (loading || !company) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <MapView companies={[company]} onSelectCompany={() => {}} currentReligion="" />
      <ChurchDialog church={company} onClose={handleClose} />
    </>
  );
}
