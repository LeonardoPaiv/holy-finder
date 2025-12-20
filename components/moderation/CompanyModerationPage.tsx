import React from 'react';
import { Building2, Power, Eye, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCompanyModerationViewModel } from '../viewmodels/CompanyModerationViewModel';
import { CompanySearch } from '../mapview/CompanySearch';
import { CompanyModerationDialog } from './CompanyModerationDialog';
import { useModeration } from '@/components/contexts/ModerationContext';

export const CompanyModerationPage: React.FC = () => {
  const {
    companies,
    pagination,
    isLoading,
    selectedCompany,
    isDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleCloseDialog,
    handleToggleFromList,
    handleStatusChanged,
    handleSelectFromSearch,
  } = useCompanyModerationViewModel();

  const { backHome } = useModeration()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
            onClick={backHome}
            title="Voltar para Moderação"
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
            <Building2 className="text-blue-600" size={28} />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Gerenciar Instituições</h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <CompanySearch
              userLocation={null}
              onSelectCompany={handleSelectFromSearch}
              active={false}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3">
            <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide">
              Instituições Inativas ({pagination.total})
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-slate-600">Carregando...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && companies.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-600">Nenhuma instituição inativa encontrada.</p>
            </div>
          )}

          {/* Companies List */}
          {!isLoading && companies.length > 0 && (
            <div className="divide-y divide-slate-100">
              {companies.map((company) => (
                <div
                  key={company._id}
                  className="p-4 md:p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    {/* Left Side - Company Info */}
                    <div className="flex-1 min-w-0 h-20 md:h-24 flex flex-col justify-between">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 line-clamp-2 leading-tight">
                        {company.name}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mb-2 line-clamp-1">
                        {company.address || 'Endereço não informado'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            company.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {company.active ? 'ATIVA' : 'INATIVA'}
                        </span>
                        <span className="text-xs text-slate-500 truncate">{company.type}</span>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex md:flex-row flex-col items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleViewDetails(company)}
                        className="p-2 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span className="hidden md:inline">Ver Detalhes</span>
                      </button>

                      <button
                        onClick={() => handleToggleFromList(company)}
                        className={`p-2 rounded-lg transition-colors ${
                          company.active
                            ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={company.active ? 'Desativar' : 'Ativar'}
                      >
                        <Power size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="border-t border-slate-200 px-4 md:px-6 py-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-slate-600">
                  Página {pagination.page} de {pagination.totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-2 md:px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs md:text-sm font-medium text-slate-700"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden md:inline">Anterior</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                    className="px-2 md:px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs md:text-sm font-medium text-slate-700"
                  >
                    <span className="hidden md:inline">Próxima</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <CompanyModerationDialog
          company={selectedCompany}
          onClose={handleCloseDialog}
          onStatusChanged={handleStatusChanged}
        />
      )}
    </div>
  );
};
