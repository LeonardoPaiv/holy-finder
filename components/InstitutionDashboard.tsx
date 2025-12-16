import React from 'react';
import { useRouter } from 'next/navigation';
import { Settings, FileText, Users, Shield, LogOut, Map } from 'lucide-react';
import { useInstitution } from '@/components/contexts/InstitutionContext';

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
  const router = useRouter();
  const { signOut } = useInstitution();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const options = [
    {
      icon: <Settings size={32} />,
      title: 'Alterar dados da instituição',
      description: 'Gerencie informações, horários e fotos.',
      onClick: () => router.push('/institution/data'),
      disabled: false
    },
    {
      icon: <Map size={32} />,
      title: 'Voltar ao Mapa',
      description: 'Retornar para a visualização do mapa principal.',
      onClick: () => router.push('/'),
      disabled: false
    },
    {
      icon: <FileText size={32} />,
      title: 'Postagens da Instituição',
      description: 'Publique novidades e avisos para a comunidade.',
      onClick: () => {},
      disabled: true
    },
    {
      icon: <Users size={32} />,
      title: 'Controle de usuários',
      description: 'Gerencie membros e permissões de acesso.',
      onClick: () => {},
      disabled: true
    },
    {
      icon: <Shield size={32} />,
      title: 'Ajude na Moderação',
      description: 'Contribua para manter a comunidade segura.',
      onClick: () => {},
      disabled: true
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
    </div>
  );
};
