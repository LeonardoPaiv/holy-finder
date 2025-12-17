'use client';

import { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import PostCard from './PostCard';
import { useInfinitePosts } from '@/hooks/useInfinitePosts';
import { CompanyService } from '@/services/companyService';

interface Filters {
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

interface User {
  _id: string;
  fullName: string;
}

export default function PostsFeedTab() {
  const { institution } = useInstitution();
  const [filters, setFilters] = useState<Filters>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfinitePosts(institution?._id || '', filters);

  // Load users for the select
  useEffect(() => {
    if (!institution?._id) return;

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await CompanyService.getCompanyUsers(institution._id);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [institution?._id]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (!institution) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors w-full justify-center"
        >
          <Filter size={18} />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel - Always visible on desktop, toggle on mobile */}
      <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Filtros</h3>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <X size={16} />
                <span>Limpar ({activeFiltersCount})</span>
              </button>
            )}
            {/* Close button for mobile */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="md:hidden p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Date From */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Creator Select */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Criador
            </label>
            <select
              value={filters.creatorId || ''}
              onChange={(e) => handleFilterChange('creatorId', e.target.value)}
              disabled={loadingUsers}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">Todos os usuários</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Post ID */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ID do Post
            </label>
            <input
              type="text"
              value={filters.postId || ''}
              onChange={(e) => handleFilterChange('postId', e.target.value)}
              placeholder="ID do post"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Carregando posts...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar posts</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600">Nenhum post encontrado</p>
          <p className="text-sm text-slate-500 mt-1">
            {activeFiltersCount > 0 ? 'Tente ajustar os filtros' : 'Crie seu primeiro post!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {/* Load More */}
          {hasNextPage && (
            <div className="text-center py-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
