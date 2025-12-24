'use client';

import React from 'react';
import { BaseSelect } from './BaseSelect';
import { ReportStatus } from '@/types';

interface ReportStatusSelectProps {
  value: ReportStatus;
  onChange: (value: ReportStatus) => void;
}

export const ReportStatusSelect: React.FC<ReportStatusSelectProps> = ({ value, onChange }) => {
  const options = [
    { value: ReportStatus.PENDING, label: 'Pendente' },
    { value: ReportStatus.SOLVED, label: 'Resolvido' },
    { value: ReportStatus.REJECTED, label: 'Rejeitado' },
  ];

  return (
    <BaseSelect
      label="Status"
      value={value}
      onChange={(val) => onChange(val as ReportStatus)}
      options={options}
    />
  );
};
