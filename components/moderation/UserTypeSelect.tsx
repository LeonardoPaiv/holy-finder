'use client';

import React from 'react';

interface UserTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserTypeSelect: React.FC<UserTypeSelectProps> = ({ value, onChange }) => {
  const userTypes = [
    { value: '', label: 'Todos os tipos' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'comum', label: 'Comum' },
    { value: 'institution admin', label: 'Admin da Instituição' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Tipo de Usuário</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {userTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};
