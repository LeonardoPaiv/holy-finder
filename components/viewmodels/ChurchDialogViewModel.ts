import { useState, useEffect } from 'react';
import { Company } from '@/types';
import { shareContent, getCompanyShareData } from '@/utils/shareUtils';

export const useChurchDialogViewModel = (church: Company | null, onClose: () => void) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');

  // Reset state when church changes
  useEffect(() => {
    setIsReporting(false);
    setReportText('');
  }, [church]);

  const handleSendReport = () => {
    // Aqui seria a integração com backend
    alert('Problema reportado com sucesso! Agradecemos sua contribuição para manter os dados atualizados.');
    setReportText('');
    setIsReporting(false);
  };

  const handleClose = () => {
    setIsReporting(false);
    onClose();
  };

  const handleShare = async () => {
    if (!church) return;
    const shareData = getCompanyShareData(church._id, church.name);
    await shareContent(shareData);
  };

  return {
    isReporting,
    setIsReporting,
    reportText,
    setReportText,
    handleSendReport,
    handleClose,
    handleShare,
  };
};
