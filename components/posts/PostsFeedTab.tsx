'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { useInfinitePosts } from '@/hooks/useInfinitePosts';
import PostCard from './PostCard';

interface Filters {
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

export default function PostsFeedTab() {
  const { institution } = useInstitution();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [tempFilters, setTempFilters] = useState<Filters>({});

  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfinitePosts(institution?._id || '', filters);

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
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
      {/* Filter Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Filtros</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={tempFilters.dateFrom || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={tempFilters.dateTo || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Creator ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ID do Criador
              </label>
              <input
                type="text"
                value={tempFilters.creatorId || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, creatorId: e.target.value })}
                placeholder="ID do usuário"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Post ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ID do Post
              </label>
              <input
                type="text"
                value={tempFilters.postId || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, postId: e.target.value })}
                placeholder="ID do post"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      )}

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
