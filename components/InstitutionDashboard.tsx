import React from 'react';
import { Settings, FileText, Users, Shield, Map } from 'lucide-react';
import { ReportForm } from '@/components/church-dialog/ReportForm';
import { useInstitutionDashboardViewModel } from './viewmodels/InstitutionDashboardViewModel';
import { InstitutionPageLayout } from './institution/InstitutionPageLayout';
import { WelcomeDialog } from './WelcomeDialog';
import { useWelcomeDialog } from '@/hooks/useWelcomeDialog';
import toast from 'react-hot-toast';

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
    isInactive,
    isReportDialogOpen,
    reportText,
    isBanned,
    isReady,
    setReportText,
    handleReportSubmit,
    handleNavigation,
    handleOpenReportDialog,
    handleCloseReportDialog
  } = useInstitutionDashboardViewModel();

  const { shouldShow, isChecking, markAsShown } = useWelcomeDialog();

  // Only build options when user is ready to prevent blinks
  const options = React.useMemo(() => {
    if (!isReady || !user) return [];

    return [
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
      ...(user.type === 'institution admin' || user.type === 'institution owner' ? [{
        icon: <Users size={32} />,
        title: 'Controle de usuários',
        description: 'Gerencie membros e permissões de acesso.',
        onClick: () => handleNavigation('/institution/users'),
        disabled: isInactive
      }] : []),
      ...(user.role === 'moderator' || user.role === 'super admin' ? [{
        icon: <Shield size={32} />,
        title: 'Área da moderação',
        description: 'Acesse o painel de moderação para gerenciar denúncias e aprovações.',
        onClick: () => handleNavigation('/institution/moderation'),
        disabled: false
      }] : []),
      ...(user.type === 'institution admin' && user.role === 'basic' ? [{
        icon: <Shield size={32} />,
        title: 'Inscrever a Moderador',
        description: 'Candidate-se para ajudar na moderação da comunidade.',
        onClick: () => {
          // Placeholder for now
          toast('Por enquanto não estamos aceitando incrições, obrigado pela compreensão!');
        },
        disabled: false
      }] : []),
    ];
  }, [user, isReady, isInactive, handleNavigation]);

  return (
    <InstitutionPageLayout title="Painel da Instituição" showBackButton={false}>
      {/* Inactive User Warning */}
      {isInactive && !isBanned && (
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

      {/* Banned User Warning */}
      {isBanned && (
        <div className="bg-red-50 border-b border-red-100 p-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-red-800">Conta Bloqueada</h3>
                <p className="text-sm text-red-700 mt-1">
                  Sua conta foi bloqueada por violar as diretrizes da comunidade. Entre em contato com o suporte se acredita que isso é um erro.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Dashboard Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((option, index) => (
              <DashboardOption key={index} {...option} />
            ))}
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      {isReportDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Reportar Problema</h2>
            <ReportForm
              churchName="Instituição"
              reportText={reportText}
              setReportText={setReportText}
              onSubmit={handleReportSubmit}
              onCancel={handleCloseReportDialog}
            />
          </div>
        </div>
      )}

      {/* Welcome Dialog */}
      {!isChecking && shouldShow && (
        <WelcomeDialog 
          isOpen={shouldShow} 
          onClose={markAsShown} 
        />
      )}
    </InstitutionPageLayout>
  );
};
