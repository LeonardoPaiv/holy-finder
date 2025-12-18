import { X } from 'lucide-react';
import { useApp } from '@/components/AppContext';

interface FeedFiltersProps {
  onClearFilters: () => void;
}

export default function FeedFilters({ onClearFilters }: FeedFiltersProps) {
  const { companies, feedFilters, setFeedFilters } = useApp();

  const handleFilterChange = (key: 'cnpj' | 'postId', value: string) => {
    setFeedFilters({
      ...feedFilters,
      [key]: value || undefined
    });
  };

  const activeFiltersCount = Object.values(feedFilters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Filtros</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X size={16} />
            <span>Limpar ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Institution Select */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Instituição
          </label>
          <select
            value={feedFilters.cnpj || ''}
            onChange={(e) => handleFilterChange('cnpj', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as instituições</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
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
            value={feedFilters.postId || ''}
            onChange={(e) => handleFilterChange('postId', e.target.value)}
            placeholder="ID do post"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
