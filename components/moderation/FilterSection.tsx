'use client';

import React from 'react';
import { X } from 'lucide-react';

interface FilterSectionProps {
  children: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
  showFilters: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  children,
  activeFiltersCount,
  onClearFilters,
  showFilters,
}) => {
  if (!showFilters) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Filtros</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            <X size={16} />
            Limpar filtros
          </button>
        )}
      </div>
      {children}
    </div>
  );
};
