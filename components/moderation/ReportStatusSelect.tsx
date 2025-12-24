'use client';

import React from 'react';
import { ReportStatus } from '@/types';

interface ReportStatusSelectProps {
  value: ReportStatus;
  onChange: (value: ReportStatus) => void;
}

export const ReportStatusSelect: React.FC<ReportStatusSelectProps> = ({ value, onChange }) => {
  const statusOptions = [
    { value: ReportStatus.PENDING, label: 'Pendente' },
    { value: ReportStatus.SOLVED, label: 'Resolvido' },
    { value: ReportStatus.REJECTED, label: 'Rejeitado' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReportStatus)}
        className="px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
