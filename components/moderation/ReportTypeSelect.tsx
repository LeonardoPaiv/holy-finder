'use client';

import React from 'react';
import { ReportType } from '@/types';

interface ReportTypeSelectProps {
  value: ReportType;
  onChange: (value: ReportType) => void;
}

export const ReportTypeSelect: React.FC<ReportTypeSelectProps> = ({ value, onChange }) => {
  const reportTypes = [
    { value: ReportType.INSTITUTION_PUBLIC_REPORT, label: 'Denúncia Pública' },
    { value: ReportType.INSTITUTION_INTERN_REPORT, label: 'Denúncia Interna' },
    { value: ReportType.APP_BUG, label: 'Bug do App' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Tipo de Report</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReportType)}
        className="px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {reportTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};
