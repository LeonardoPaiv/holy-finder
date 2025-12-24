'use client';

import React from 'react';
import { X, User, Mail, Calendar } from 'lucide-react';

interface UserDialogProps {
  isOpen: boolean;
  user: {
    _id: string;
    fullName: string;
    email: string;
    createdAt?: string;
  } | null;
  onClose: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <User className="text-green-600" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Informações do Usuário</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="text-blue-400 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-sm text-slate-500">Nome Completo</p>
              <p className="text-slate-800 font-medium">{user.fullName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="text-blue-400 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-800 font-medium break-all">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-400 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Membro desde</p>
                <p className="text-slate-800 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">ID do Usuário</p>
            <p className="text-slate-800 font-mono text-sm break-all">{user._id}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
