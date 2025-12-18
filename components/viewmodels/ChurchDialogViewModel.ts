import { useState, useEffect } from 'react';
import { Company } from '@/types';
import { shareContent, getCompanyShareData } from '@/utils/shareUtils';
import { GOOGLE_MAPS_URL } from '@/utils/constants';

export const useChurchDialogViewModel = (church: Company | null, onClose: () => void) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Reset state when church changes
  useEffect(() => {
    setIsReporting(false);
    setReportText('');
    setShowPreview(false);
  }, [church]);

  const handleSendReport = () => {
    // Aqui seria a integração com backend
    alert('Problema reportado com sucesso! Agradecemos sua contribuição para manter os dados atualizados.');
    setReportText('');
    setIsReporting(false);
  };

  const handleClose = () => {
    setIsReporting(false);
    setShowPreview(false);
    onClose();
  };

  const handleShare = async () => {
    if (!church) return;
    const shareData = getCompanyShareData(church._id, church.name);
    await shareContent(shareData);
  };

  const handleGetDirections = () => {
    if (!church) return;
    
    if (church.dedicatedMapsUrl) {
      window.open(church.dedicatedMapsUrl, '_blank');
    } else {
      const { coordinates } = church.geo;
      // Leaflet uses [lat, lng] but GeoJSON is [lng, lat]. 
      // Based on previous MapView code, coordinates[1] is lat and coordinates[0] is lng.
      const lat = coordinates[1];
      const lng = coordinates[0];
      window.open(GOOGLE_MAPS_URL(lat, lng), '_blank');
    }
  };

  const handleOpenPreview = () => setShowPreview(true);
  const handleClosePreview = () => setShowPreview(false);
  const handleOpenReport = () => setIsReporting(true);
  const handleCancelReport = () => setIsReporting(false);
  
  const handleNavigateToPosts = () => {
    if (church) {
      window.location.href = `/feed?cnpj=${church._id}`;
    }
  };

  return {
    isReporting,
    reportText,
    setReportText,
    showPreview,
    handleSendReport,
    handleClose,
    handleShare,
    handleGetDirections,
    handleOpenPreview,
    handleClosePreview,
    handleOpenReport,
    handleCancelReport,
    handleNavigateToPosts
  };
};
