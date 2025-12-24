'use client';

import React from 'react';
import { ArrowLeft, Filter } from 'lucide-react';

interface ModerationPageHeaderProps {
  title: string;
  onBack: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;
}

export const ModerationPageHeader: React.FC<ModerationPageHeaderProps> = ({
  title,
  onBack,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
}) => {
  return (
    <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </div>

        <button
          onClick={onToggleFilters}
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
  );
};
