import { useState, useEffect, useCallback } from 'react';
import { ModerationService } from '@/services/moderationService';
import { ReportType, ReportStatus } from '@/types';

export const useReportsPageViewModel = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [reportType, setReportType] = useState<ReportType>(ReportType.INSTITUTION_PUBLIC_REPORT);
  const [reportStatus, setReportStatus] = useState<ReportStatus>(ReportStatus.PENDING);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [reportId, setReportId] = useState('');

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        type: reportType,
        status: reportStatus,
      };

      if (selectedCompany) {
        filters.cnpj = selectedCompany._id;
      }

      if (reportId.trim()) {
        filters.reportId = reportId.trim();
      }

      const result = await ModerationService.getReports(page, 10, filters);

      if (result) {
        setReports(result.data);
        setTotalPages(result.pagination.totalPages);
        setHasMore(result.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, reportType, reportStatus, selectedCompany, reportId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    setPage(1);
  };

  const handleReportStatusChange = (status: ReportStatus) => {
    setReportStatus(status);
    setPage(1);
  };

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company);
    setPage(1);
  };

  const handleReportIdChange = (id: string) => {
    setReportId(id);
    setPage(1);
  };

  const handleClearFilters = () => {
    setReportType(ReportType.INSTITUTION_PUBLIC_REPORT);
    setReportStatus(ReportStatus.PENDING);
    setSelectedCompany(null);
    setReportId('');
    setPage(1);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const activeFiltersCount = [
    reportStatus !== ReportStatus.PENDING,
    selectedCompany !== null,
    reportId.trim() !== '',
  ].filter(Boolean).length;

  return {
    reports,
    isLoading,
    page,
    totalPages,
    hasMore,
    reportType,
    reportStatus,
    selectedCompany,
    reportId,
    activeFiltersCount,
    handleReportTypeChange,
    handleReportStatusChange,
    handleCompanySelect,
    handleReportIdChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
    refetch: fetchReports,
  };
};
