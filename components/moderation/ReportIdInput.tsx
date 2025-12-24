'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface ReportIdInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ReportIdInput: React.FC<ReportIdInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">ID do Report</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite o ID do report..."
          className="w-full px-4 py-3 pr-10 bg-white border border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>
    </div>
  );
};
