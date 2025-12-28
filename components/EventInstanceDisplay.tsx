import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Event } from '@/types';

interface EventInstanceDisplayProps {
  event: Event;
  variant?: 'compact' | 'detailed';
  className?: string;
}

/**
 * Componente para exibir informações de um evento
 * Suporta tanto eventos recorrentes (dias da semana) quanto eventos em datas específicas
 */
export const EventInstanceDisplay: React.FC<EventInstanceDisplayProps> = ({
  event,
  variant = 'compact',
  className = ''
}) => {
  const formatDateToBR = (dateISO: string): string => {
    const [year, month, day] = dateISO.split('-');
    return `${day}/${month}/${year}`;
  };

  const hasSpecificDates = event.dates && event.dates.length > 0;
  const hasRecurringDays = event.days && event.days.length > 0;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className="text-sm font-bold text-purple-600">{event.name}</div>
        
        {/* Datas ou Dias */}
        <div className="flex items-start gap-2">
          <Calendar size={16} className="text-green-500 mt-0.5 shrink-0" />
          <span className="font-bold text-slate-800 text-sm">
            {hasSpecificDates 
              ? event.dates!.map(formatDateToBR).join(', ')
              : hasRecurringDays
                ? event.days!.join(', ')
                : 'Sem data definida'
            }
          </span>
        </div>

        {/* Horários */}
        <div className="flex flex-wrap gap-2">
          {event.hours.map((time, idx) => (
            <span 
              key={idx} 
              className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-2.5 py-1 rounded-md shadow-sm"
            >
              {time}
            </span>
          ))}
        </div>

        {/* Descrição (se houver) */}
        {event.description && (
          <p className="text-xs text-slate-500 italic">{event.description}</p>
        )}
      </div>
    );
  }

  // Variant: detailed
  return (
    <div className={`bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 ${className}`}>
      <h4 className="text-lg font-bold text-purple-600">{event.name}</h4>

      {/* Datas ou Dias */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Calendar size={18} className="text-green-500" />
          <span>
            {hasSpecificDates ? 'Datas Específicas:' : hasRecurringDays ? 'Dias da Semana:' : 'Data:'}
          </span>
        </div>
        <div className="pl-6">
          {hasSpecificDates ? (
            <div className="flex flex-wrap gap-2">
              {event.dates!.map((date, idx) => (
                <span 
                  key={idx}
                  className="bg-green-100 border border-green-200 text-green-800 text-sm font-medium px-3 py-1.5 rounded-lg"
                >
                  📅 {formatDateToBR(date)}
                </span>
              ))}
            </div>
          ) : hasRecurringDays ? (
            <p className="text-slate-700 font-medium">{event.days!.join(', ')}</p>
          ) : (
            <p className="text-slate-400 italic text-sm">Sem data definida</p>
          )}
        </div>
      </div>

      {/* Horários */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Clock size={18} className="text-blue-500" />
          <span>Horários:</span>
        </div>
        <div className="pl-6 flex flex-wrap gap-2">
          {event.hours.map((time, idx) => (
            <span 
              key={idx}
              className="bg-blue-100 border border-blue-200 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg"
            >
              ⏰ {time}
            </span>
          ))}
        </div>
      </div>

      {/* Descrição */}
      {event.description && (
        <div className="pt-3 border-t border-slate-200">
          <p className="text-sm text-slate-600 italic">{event.description}</p>
        </div>
      )}
    </div>
  );
};
