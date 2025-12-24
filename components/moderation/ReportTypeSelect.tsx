'use client';

import React from 'react';
import { BaseSelect } from './BaseSelect';
import { ReportType } from '@/types';

interface ReportTypeSelectProps {
  value: ReportType;
  onChange: (value: ReportType) => void;
}

export const ReportTypeSelect: React.FC<ReportTypeSelectProps> = ({ value, onChange }) => {
  const options = [
    { value: ReportType.INSTITUTION_PUBLIC_REPORT, label: 'Denúncia Pública' },
    { value: ReportType.INSTITUTION_INTERN_REPORT, label: 'Denúncia Interna' },
    { value: ReportType.APP_BUG, label: 'Bug do App' },
  ];

  return (
    <BaseSelect
      label="Tipo de Report"
      value={value}
      onChange={(val) => onChange(val as ReportType)}
      options={options}
    />
  );
};
