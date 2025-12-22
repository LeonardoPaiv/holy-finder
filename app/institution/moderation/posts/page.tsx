'use client';

import React from 'react';
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePostsReportsPageViewModel } from '@/components/viewmodels/PostsReportsPageViewModel';
import { PostReportCard } from '@/components/moderation/PostReportCard';
import { CompanySearch } from '@/components/mapview/CompanySearch';
import { UserSearch } from '@/components/moderation/UserSearch';
import { useApp } from '@/components/AppContext';

export default function PostsModerationPage() {
  const router = useRouter();
  const { userLocation } = useApp();
  const {
    postsReports,
    isLoading,
    page,
    totalPages,
    hasMore,
    selectedCompany,
    selectedUser,
    status,
    postId,
    activeFiltersCount,
    handleCompanySelect,
    handleUserSelect,
    handleStatusChange,
    handlePostIdChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  } = usePostsReportsPageViewModel();

  const [showFilters, setShowFilters] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/institution/moderation')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Moderação de Posts
                </h1>
                <p className="text-sm text-slate-600">
                  Gerencie denúncias de posts
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Filtros</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Limpar ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Company Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instituição
                </label>
                <CompanySearch
                  userLocation={userLocation}
                  selectedCompany={selectedCompany}
                  onSelectCompany={handleCompanySelect}
                />
              </div>

              {/* User Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Usuário
                </label>
                <UserSearch
                  selectedUser={selectedUser}
                  onSelectUser={handleUserSelect}
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="SOLVED">Resolvido</option>
                  <option value="REJECTED">Rejeitado</option>
                </select>
              </div>

              {/* Post ID Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ID do Post
                </label>
                <input
                  type="text"
                  value={postId}
                  onChange={(e) => handlePostIdChange(e.target.value)}
                  placeholder="ID específico do post"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Posts Reports List */}
        {!isLoading && postsReports.length > 0 && (
          <div className="space-y-4">
            {postsReports.map((postReport) => (
              <PostReportCard 
                key={postReport._id} 
                postReport={postReport}
                onFilterByCompany={(cnpj) => {
                  // Create a minimal company object from the postReport data
                  const company = {
                    _id: cnpj,
                    name: postReport.cnpj?.name || '',
                  };
                  handleCompanySelect(company as any);
                }}
                onFilterByUser={(user) => {
                  handleUserSelect(user);
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && postsReports.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Nenhuma denúncia encontrada</p>
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
    </div>
  );
}
