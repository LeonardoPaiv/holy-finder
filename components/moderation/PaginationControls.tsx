'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  hasMore: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  hasMore,
  onPrevPage,
  onNextPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <button
        onClick={onPrevPage}
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
        onClick={onNextPage}
        disabled={!hasMore}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
