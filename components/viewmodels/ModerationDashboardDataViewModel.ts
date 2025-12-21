import { Building2, Users, FileText, AlertTriangle } from 'lucide-react';
import { useModeration } from '../contexts/ModerationContext';

export const useModerationDashboardViewModel = () => {
  const { status, loadingStatus } = useModeration();

  const analyticsData = status ? [
    { icon: Building2, count: status.activeCompanies, label: 'Instituições Ativas', color: 'blue' },
    { icon: Users, count: status.activeUsers, label: 'Usuários Ativos', color: 'green' },
    { icon: FileText, count: status.totalPosts, label: 'Posts Publicados', color: 'purple' },
    { icon: AlertTriangle, count: status.pendingReports, label: 'Reports Pendentes', color: 'orange' },
  ] : [];

  const navigationCards = [
    {
      title: 'Instituições para análise',
      count: status?.inactiveCompanies || 0,
      icon: Building2,
      href: '/institution/moderation/companies',
      color: 'blue',
    },
    {
      title: 'Gerenciamento de usuários',
      count: 0,
      icon: Users,
      href: '#',
      color: 'green',
    },
    {
      title: 'Gerenciamento de posts',
      count: 0,
      icon: FileText,
      href: '#',
      color: 'purple',
    },
    {
      title: 'Visualizar reports',
      count: status?.pendingReports || 0,
      icon: AlertTriangle,
      href: '#',
      color: 'orange',
    },
  ];

  return {
    analyticsData,
    navigationCards,
    loadingStatus,
  };
};
