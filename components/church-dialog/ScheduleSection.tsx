import React from 'react';
import { Event } from '../../types';
import { LucideIcon } from 'lucide-react';

interface ScheduleSectionProps {
  title: string;
  icon: LucideIcon;
  items: Event[];
  emptyMessage: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ title, icon: Icon, items, emptyMessage }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 font-semibold text-slate-800 border-b pb-2">
        <Icon className={title === 'Celebrações' ? "text-orange-500" : "text-blue-500"} size={20} />
        <span>{title}</span>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex flex-col text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-xs text-slate-500 flex flex-col gap-1">
                <span className="font-medium text-slate-700">{item.days.join(', ')}</span>
                <span>{item.hours.join(', ')}</span>
              </div>
              {item.description && <div className="text-xs italic text-slate-400 mt-1 border-t border-slate-200 pt-1">{item.description}</div>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 italic">{emptyMessage}</p>
      )}
    </div>
  );
};
