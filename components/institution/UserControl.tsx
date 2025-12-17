import React, { useState, useEffect } from 'react';
import { CompanyService } from '@/services/companyService';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { User, UserType } from '@/types';
import { Shield, Users, AlertCircle, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserControl = () => {
  const { institution, user: currentUser } = useInstitution();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (institution?._id) {
      fetchUsers();
    }
  }, [institution]);

  const fetchUsers = async () => {
    if (!institution?._id) return;
    try {
      const data = await CompanyService.getCompanyUsers(institution._id);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newType: UserType) => {
    if (!institution?._id) return;
    setUpdatingUserId(userId);
    try {
      await CompanyService.updateCompanyUserRole(institution._id, userId, newType);
      setUsers(users.map(u => u._id === userId ? { ...u, type: newType } : u));
      toast.success('Permissão atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar permissão.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Explanations */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-4">
          <Shield size={20} />
          Níveis de Acesso
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="font-bold text-slate-700">Inativo</span>
            </div>
            <p className="text-sm text-slate-600">
              Usuário sem acesso a nenhuma funcionalidade do painel.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-bold text-slate-700">Comum</span>
            </div>
            <p className="text-sm text-slate-600">
              Acesso para criar posts e editar eventos/celebrações.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="font-bold text-slate-700">Admin</span>
            </div>
            <p className="text-sm text-slate-600">
              Acesso total, incluindo edição de dados da instituição e controle de usuários.
            </p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-slate-500" />
            Usuários da Instituição
          </h3>
          <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            {users.length} usuários
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {users.map((user) => (
            <div key={user._id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0
                  ${user.type === 'institution admin' ? 'bg-purple-600' : 
                    user.type === 'comum' ? 'bg-blue-500' : 'bg-slate-400'}`}
                >
                  {user.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{user.fullName || 'Usuário sem nome'}</h4>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={user.type}
                  onChange={(e) => handleRoleChange(user._id, e.target.value as UserType)}
                  disabled={updatingUserId === user._id || user._id === currentUser?._id}
                  className={`w-full md:w-48 px-4 py-2 rounded-lg border text-sm font-medium outline-none transition-all cursor-pointer
                    ${user.type === 'institution admin' 
                      ? 'bg-purple-50 border-purple-200 text-purple-700 focus:ring-2 focus:ring-purple-500/20' 
                      : user.type === 'comum'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 focus:ring-2 focus:ring-slate-500/20'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <option value="inactive">Inativo</option>
                  <option value="comum">Comum</option>
                  <option value="institution admin">Admin da Instituição</option>
                </select>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
