import React from 'react';
import { Settings, FileText, Users, Shield, LogOut, Map } from 'lucide-react';
import { ReportForm } from '@/components/church-dialog/ReportForm';
import { useInstitutionDashboardViewModel } from './viewmodels/InstitutionDashboardViewModel';

interface DashboardOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const DashboardOption: React.FC<DashboardOptionProps> = ({ icon, title, description, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 transition-all
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-md hover:border-blue-200 hover:-translate-y-1 cursor-pointer'
      }
    `}
  >
    <div className={`p-4 rounded-full mb-4 ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">{title}</h3>
    <p className="text-sm text-slate-500 text-center">{description}</p>
  </button>
);

export const InstitutionDashboard: React.FC = () => {
  const {
    user,
    institution,
    isInactive,
    isReportDialogOpen,
    reportText,
    setReportText,
    handleLogout,
    handleReportSubmit,
    handleNavigation,
    handleOpenReportDialog,
    handleCloseReportDialog
  } = useInstitutionDashboardViewModel();

  const options = [
    {
      icon: <Settings size={32} />,
      title: 'Alterar dados da instituição',
      description: 'Gerencie informações, horários e fotos.',
      onClick: () => handleNavigation('/institution/data'),
      disabled: isInactive
    },
    {
      icon: <Map size={32} />,
      title: 'Voltar ao Mapa',
      description: 'Retornar para a visualização do mapa principal.',
      onClick: () => handleNavigation('/'),
      disabled: isInactive
    },
    {
      icon: <FileText size={32} />,
      title: 'Postagens da Instituição',
      description: 'Publique novidades e avisos para a comunidade.',
      onClick: () => handleNavigation('/institution/posts'),
      disabled: isInactive
    },
    ...(user?.type === 'institution admin' ? [{
      icon: <Users size={32} />,
      title: 'Controle de usuários',
      description: 'Gerencie membros e permissões de acesso.',
      onClick: () => handleNavigation('/institution/users'),
      disabled: isInactive
    }] : []),
    ...(user?.type === 'moderator' || user?.type === 'super admin' ? [{
      icon: <Shield size={32} />,
      title: 'Área da moderação',
      description: 'Acesse o painel de moderação para gerenciar denúncias e aprovações.',
      onClick: () => handleNavigation('/institution/moderation'),
      disabled: false
    }] : []),
    ...(user?.type === 'institution admin' ? [{
      icon: <Shield size={32} />,
      title: 'Inscrever a Moderador',
      description: 'Candidate-se para ajudar na moderação da comunidade.',
      onClick: () => {
        // Placeholder for now
        alert('Funcionalidade em breve!');
      },
      disabled: false
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
           <img src="/logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
           <h2 className="text-lg font-bold text-slate-800">Painel da Instituição</h2>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
        >
          <LogOut size={20} />
          <span className="hidden md:inline text-sm font-medium">Sair</span>
        </button>
      </div>

      {/* Inactive User Warning */}
      {isInactive && (
        <div className="bg-orange-50 border-b border-orange-100 p-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-full text-orange-600 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-orange-800">Conta Aguardando Ativação</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Seu usuário precisa ser ativado pelo administrador da instituição para acessar os recursos do painel.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenReportDialog}
              className="px-4 py-2 bg-white border border-orange-200 text-orange-700 font-bold text-sm rounded-lg hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap"
            >
              Reportar Problema
            </button>
          </div>
        </div>
      )}

      {/* Inactive Institution Warning */}
      {institution && !institution.active && !isInactive && (
        <div className="bg-yellow-50 border-b border-yellow-100 p-4">
          <div className="max-w-5xl mx-auto flex flex-start gap-3">
            <div className="h-fit p-2 bg-yellow-100 rounded-full text-yellow-600 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-yellow-800">Instituição em Análise</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Sua instituição está atualmente inativa e não aparecerá nas buscas. Ela entrará na fila de aprovação assim que os dados forem atualizados e diferirem do padrão de criação, caso já tenha alterado os dados, aguarde a aprovação. Obrigado pela compreensão.
              </p>
              <p className="text-sm text-amber-600 mt-2">
                Nota: O status também pode ter sido alterado por um moderador devido a violação dos termos de uso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao seu Painel</h1>
          <p className="text-slate-500">Selecione uma opção abaixo para começar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {options.map((option, index) => (
            <DashboardOption key={index} {...option} />
          ))}
        </div>
      </div>

      {/* Report Dialog Overlay */}
      {isReportDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <ReportForm
              churchName={institution?.name || 'Minha Instituição'}
              reportText={reportText}
              setReportText={setReportText}
              onCancel={handleCloseReportDialog}
              onSubmit={handleReportSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};
