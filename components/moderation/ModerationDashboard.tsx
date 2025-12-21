import React from 'react';
import { Shield, ArrowLeft, ChevronRight } from 'lucide-react';
import { useModerationDashboardViewModel as useAuthViewModel } from '@/components/viewmodels/ModerationDashboardViewModel';
import { useModerationDashboardViewModel } from '@/components/viewmodels/ModerationDashboardDataViewModel';
import { useRouter } from 'next/navigation';
import { AnalyticsCard } from './AnalyticsCard';

export const ModerationDashboard: React.FC = () => {
  const { user, loading, handleBack } = useAuthViewModel();
  const { analyticsData, navigationCards, loadingStatus } = useModerationDashboardViewModel();
  const router = useRouter();

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; icon: string; badge: string }> = {
      blue: {
        bg: 'bg-blue-50',
        hover: 'hover:bg-blue-100',
        icon: 'text-blue-600',
        badge: 'bg-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        hover: 'hover:bg-green-100',
        icon: 'text-green-600',
        badge: 'bg-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        hover: 'hover:bg-purple-100',
        icon: 'text-purple-600',
        badge: 'bg-purple-600',
      },
      orange: {
        bg: 'bg-orange-50',
        hover: 'hover:bg-orange-100',
        icon: 'text-orange-600',
        badge: 'bg-orange-600',
      },
    };
    return colors[color] || colors.blue;
  };

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
        {/* Analytics Row */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
          {loadingStatus ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-3 md:p-6 animate-pulse">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="w-5 h-5 bg-slate-200 rounded"></div>
                  <div className="w-12 h-6 md:w-16 md:h-8 bg-slate-200 rounded"></div>
                </div>
                <div className="w-20 h-3 md:h-4 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : (
            analyticsData.map((data, index) => (
              <AnalyticsCard
                key={index}
                icon={data.icon}
                count={data.count}
                label={data.label}
                color={data.color}
              />
            ))
          )}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            const colors = getColorClasses(card.color);

            return (
              <button
                key={card.title}
                onClick={() => router.push(card.href)}
                className={`${colors.bg} ${colors.hover} rounded-xl border border-slate-200 p-6 transition-all hover:shadow-md text-left group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                    <Icon className={colors.icon} size={28} />
                  </div>
                  <span className={`${colors.badge} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                    {card.count}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{card.title}</h3>
                    <p className="text-sm text-slate-600">Clique para acessar</p>
                  </div>
                  <ChevronRight
                    className="text-slate-400 group-hover:text-slate-600 transition-colors"
                    size={24}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
