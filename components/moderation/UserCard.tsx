'use client';

import React from 'react';
import { User, Building2, Ban } from 'lucide-react';

interface UserCardProps {
  user: any;
  currentUserRole?: string;
  onBan?: (userId: string) => void;
  onRoleChange?: (email: string, role: string) => void;
  onTypeChange?: (email: string, type: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  currentUserRole,
  onBan,
  onRoleChange,
  onTypeChange 
}) => {
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'inactive':
        return 'Inativo';
      case 'comum':
        return 'Comum';
      case 'institution admin':
        return 'Admin da Instituição';
      case 'institution owner':
        return 'Dono da Instituição';
      default:
        return type;
    }
  };

  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case 'basic':
        return 'Básico';
      case 'moderator':
        return 'Moderador';
      case 'super admin':
        return 'Super Admin';
      case 'banned':
        return 'Banido';
      default:
        return role;
    }
  };

  // Permission checks
  const isModerator = currentUserRole === 'moderator';
  const isSuperAdmin = currentUserRole === 'super admin';
  const isTargetSuperAdmin = user.role === 'super admin';
  
  // Moderators cannot modify super admins
  const canModify = isSuperAdmin || (isModerator && !isTargetSuperAdmin);
  
  // Moderators can only set role to banned or basic
  const availableRoles = isModerator 
    ? ['basic', 'banned']
    : ['basic', 'moderator', 'super admin', 'banned'];
  
  const availableTypes = ['inactive', 'comum', 'institution admin', 'institution owner'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        {/* User Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-800">{user.fullName}</h3>
          </div>
          
          {user.institution && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 size={16} className="text-slate-400" />
              <span>{user.institution.name || 'Instituição não encontrada'}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{user.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          {/* Ban Button */}
          <button
            onClick={() => onBan?.(user._id)}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            title="Banir usuário"
          >
            <Ban size={16} />
            Banir Usuário
          </button>

          {/* Role Select */}
          <div>
            <select
              value={user.role}
              onChange={(e) => onRoleChange?.(user.email, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canModify}
              title={!canModify ? 'Você não tem permissão para modificar este usuário' : ''}
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {getUserRoleLabel(role)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Select */}
          <div>
            <select
              value={user.type}
              onChange={(e) => onTypeChange?.(user.email, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canModify}
              title={!canModify ? 'Você não tem permissão para modificar este usuário' : ''}
            >
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {getUserTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
