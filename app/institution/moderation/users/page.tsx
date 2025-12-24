'use client';

import React from 'react';
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsersPageViewModel } from '@/components/viewmodels/UsersPageViewModel';
import { UserCard } from '@/components/moderation/UserCard';
import { UserSearch } from '@/components/moderation/UserSearch';
import { CompanySearch } from '@/components/mapview/CompanySearch';
import { UserTypeSelect } from '@/components/moderation/UserTypeSelect';
import { UserRoleSelect } from '@/components/moderation/UserRoleSelect';
import { useApp } from '@/components/AppContext';

export default function UsersModerationPage() {
  const router = useRouter();
  const { userLocation } = useApp();
  const {
    users,
    isLoading,
    page,
    totalPages,
    hasMore,
    selectedUser,
    selectedCompany,
    userType,
    userRole,
    activeFiltersCount,
    handleUserSelect,
    handleCompanySelect,
    handleUserTypeChange,
    handleUserRoleChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  } = useUsersPageViewModel();

  const [showFilters, setShowFilters] = React.useState(true);

  const handleBanUser = (userId: string) => {
    // Placeholder for ban user functionality
    console.log('Ban user:', userId);
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
            <h1 className="text-xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
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
              {/* User Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Usuário</label>
                <UserSearch
                  selectedUser={selectedUser}
                  onSelectUser={handleUserSelect}
                />
              </div>

              {/* Company Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Instituição</label>
                <CompanySearch
                  selectedCompany={selectedCompany}
                  onSelectCompany={handleCompanySelect}
                  userLocation={userLocation}
                />
              </div>

              {/* User Type */}
              <UserTypeSelect
                value={userType}
                onChange={handleUserTypeChange}
              />

              {/* User Role */}
              <UserRoleSelect
                value={userRole}
                onChange={handleUserRoleChange}
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

        {/* Users List */}
        {!isLoading && users.length > 0 && (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onBan={handleBanUser}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Nenhum usuário encontrado</p>
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
