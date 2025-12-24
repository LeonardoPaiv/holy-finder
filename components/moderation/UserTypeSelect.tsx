'use client';

import React from 'react';
import { BaseSelect } from './BaseSelect';

interface UserTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserTypeSelect: React.FC<UserTypeSelectProps> = ({ value, onChange }) => {
  const options = [
    { value: '', label: 'Todos os tipos' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'comum', label: 'Comum' },
    { value: 'institution admin', label: 'Admin da Instituição' },
  ];

  return (
    <BaseSelect
      label="Tipo de Usuário"
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};
