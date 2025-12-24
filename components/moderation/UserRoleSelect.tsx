'use client';

import React from 'react';
import { BaseSelect } from './BaseSelect';

interface UserRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ value, onChange }) => {
  const options = [
    { value: '', label: 'Todas as roles' },
    { value: 'basic', label: 'Básico' },
    { value: 'moderator', label: 'Moderador' },
    { value: 'super admin', label: 'Super Admin' },
    { value: 'banned', label: 'Banido' },
  ];

  return (
    <BaseSelect
      label="Role do Usuário"
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};
