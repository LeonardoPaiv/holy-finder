import { useState } from 'react';

export const usePostReportCardViewModel = (reports: string[]) => {
  const [showAllReports, setShowAllReports] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const visibleReports = showAllReports ? reports : reports.slice(0, 3);
  const hasMoreReports = reports.length > 3;
  const remainingCount = reports.length - 3;

  const handleToggleReports = () => {
    setShowAllReports(!showAllReports);
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return {
    visibleReports,
    hasMoreReports,
    remainingCount,
    showAllReports,
    showFullDescription,
    handleToggleReports,
    handleToggleDescription,
  };
};
