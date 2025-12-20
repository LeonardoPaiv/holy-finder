import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  icon: LucideIcon;
  count: number;
  label: string;
  color: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon: Icon, count, label, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  const iconColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-3 md:p-6">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <Icon className={`${iconColor}`} size={20} />
        <p className="text-xl md:text-3xl font-bold text-slate-900">{count}</p>
      </div>
      <p className="text-[10px] md:text-sm text-slate-600">{label}</p>
    </div>
  );
};
