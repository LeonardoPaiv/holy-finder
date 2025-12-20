import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useModerationDashboardViewModel } from '@/components/viewmodels/ModerationDashboardViewModel';

export const ModerationDashboard: React.FC = () => {
  const { user, loading, handleBack } = useModerationDashboardViewModel();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isModerator = user.role === 'moderator' || user.role === 'super admin';
  if (!isModerator) {
    return null; // Will redirect in ViewModel
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Shield size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Painel de Moderação</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Bem-vindo à Moderação</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Esta área é dedicada para moderadores e administradores gerenciarem denúncias e aprovações da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};
