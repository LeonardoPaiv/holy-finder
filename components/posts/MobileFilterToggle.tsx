import { Filter } from 'lucide-react';

interface MobileFilterToggleProps {
  onClick: () => void;
  activeFiltersCount: number;
}

export default function MobileFilterToggle({ onClick, activeFiltersCount }: MobileFilterToggleProps) {
  return (
    <div className="md:hidden">
      <button
        onClick={onClick}
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
  );
}
