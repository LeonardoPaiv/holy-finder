import { useState } from 'react';
import { ReportService } from '@/services/reportService';
import { ReportType } from '@/types';
import toast from 'react-hot-toast';

export const useReportAppDialogViewModel = (onClose: () => void) => {
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReport = async () => {
    if (!reportText.trim()) return;

    setIsLoading(true);
    try {
      await ReportService.createReport({
        type: ReportType.APP_BUG,
        description: reportText
      });
      toast.success('Report enviado com sucesso! Obrigado pelo feedback.');
      setReportText('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Erro ao enviar report. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reportText,
    setReportText,
    isLoading,
    handleSendReport
  };
};
