'use client';

import React from 'react';

interface UserRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ value, onChange }) => {
  const userRoles = [
    { value: '', label: 'Todas as roles' },
    { value: 'basic', label: 'Básico' },
    { value: 'moderator', label: 'Moderador' },
    { value: 'super admin', label: 'Super Admin' },
    { value: 'banned', label: 'Banido' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Role do Usuário</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {userRoles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </div>
  );
};
