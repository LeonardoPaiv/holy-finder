'use client';

import React from 'react';
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReportsPageViewModel } from '@/components/viewmodels/ReportsPageViewModel';
import { ReportCard } from '@/components/moderation/ReportCard';
import { ReportTypeSelect } from '@/components/moderation/ReportTypeSelect';
import { ReportStatusSelect } from '@/components/moderation/ReportStatusSelect';
import { CompanySearch } from '@/components/mapview/CompanySearch';
import { ReportIdInput } from '@/components/moderation/ReportIdInput';
import { ChurchDialog } from '@/components/ChurchDialog';
import { UserDialog } from '@/components/moderation/UserDialog';
import { useApp } from '@/components/AppContext';
import { useSolveReport } from '@/hooks/useSolveReport';
import { useRejectReport } from '@/hooks/useRejectReport';
import { useRevertReportToPending } from '@/hooks/useRevertReportToPending';
import { SolveReportDialog } from '@/components/moderation/SolveReportDialog';
import { RejectReportDialog } from '@/components/moderation/RejectReportDialog';
import { RevertReportToPendingDialog } from '@/components/moderation/RevertReportToPendingDialog';

export default function ReportsModerationPage() {
  const router = useRouter();
  const { userLocation } = useApp();
  const {
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
    refetch,
  } = useReportsPageViewModel();

  const { isDialogOpen: isSolveDialogOpen, selectedReportId: reportToSolve, openSolveDialog, closeSolveDialog, confirmSolve } = useSolveReport({
    onSuccess: () => refetch(),
  });

  const { isDialogOpen: isRejectDialogOpen, selectedReportId: reportToReject, openRejectDialog, closeRejectDialog, confirmReject } = useRejectReport({
    onSuccess: () => refetch(),
  });

  const { isDialogOpen: isRevertDialogOpen, selectedReportId: reportToRevert, openRevertDialog, closeRevertDialog, confirmRevert } = useRevertReportToPending({
    onSuccess: () => refetch(),
  });

  const [showFilters, setShowFilters] = React.useState(true);
  const [selectedInstitution, setSelectedInstitution] = React.useState<any>(null);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  const handleViewInstitution = async (cnpj: string) => {
    // Fetch company data - for now we'll use a simple approach
    // In a real scenario, you might want to fetch full company details
    const company = reports.find(r => r.cnpj?._id === cnpj)?.cnpj;
    if (company) {
      setSelectedInstitution({ _id: company._id, name: company.name });
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Moderação de Reports</h1>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Filter size={18} />
            <span className="hidden md:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Filtros</h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <X size={16} />
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Report Type */}
              <ReportTypeSelect
                value={reportType}
                onChange={handleReportTypeChange}
              />

              {/* Status */}
              <ReportStatusSelect
                value={reportStatus}
                onChange={handleReportStatusChange}
              />

              {/* Company Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Instituição</label>
                <CompanySearch
                  selectedCompany={selectedCompany}
                  onSelectCompany={handleCompanySelect}
                  userLocation={userLocation}
                />
              </div>

              {/* Report ID */}
              <ReportIdInput
                value={reportId}
                onChange={handleReportIdChange}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onSolve={openSolveDialog}
                onReject={openRejectDialog}
                onRevert={openRevertDialog}
                onViewInstitution={handleViewInstitution}
                onViewUser={handleViewUser}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && reports.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Nenhum report encontrado</p>
            <p className="text-sm text-slate-500 mt-1">
              Tente ajustar os filtros para ver mais resultados
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <span className="text-sm text-slate-600">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Solve Report Dialog */}
      <SolveReportDialog
        isOpen={isSolveDialogOpen}
        reportId={reportToSolve || ''}
        onConfirm={confirmSolve}
        onClose={closeSolveDialog}
      />

      {/* Reject Report Dialog */}
      <RejectReportDialog
        isOpen={isRejectDialogOpen}
        reportId={reportToReject || ''}
        onConfirm={confirmReject}
        onClose={closeRejectDialog}
      />

      {/* Revert Report Dialog */}
      <RevertReportToPendingDialog
        isOpen={isRevertDialogOpen}
        reportId={reportToRevert || ''}
        onConfirm={confirmRevert}
        onClose={closeRevertDialog}
      />

      {/* Church Dialog */}
      <ChurchDialog
        church={selectedInstitution}
        onClose={() => setSelectedInstitution(null)}
      />

      {/* User Dialog */}
      <UserDialog
        isOpen={selectedUser !== null}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
