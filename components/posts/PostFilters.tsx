import { X } from 'lucide-react';
import { useInstitutionPost } from '../contexts/InstitutionPostContext';

interface Filters {
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

interface PostFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  showMobileFilters: boolean;
  onCloseMobile: () => void;
}

export default function PostFilters({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  showMobileFilters,
  onCloseMobile,
}: PostFiltersProps) {
  const { users, loadingUsers } = useInstitutionPost();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Filtros</h3>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <X size={16} />
              <span>Limpar ({activeFiltersCount})</span>
            </button>
          )}
          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
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
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
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
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
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
            onChange={(e) => onFilterChange('creatorId', e.target.value)}
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
            onChange={(e) => onFilterChange('postId', e.target.value)}
            placeholder="ID do post"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
