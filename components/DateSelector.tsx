import React from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useDateSelector } from '@/hooks/useDateSelector';

interface DateSelectorProps {
  selectedDates: string[];      // Array de datas ISO (YYYY-MM-DD)
  onDatesChange: (dates: string[]) => void;
  label?: string;
  maxDates?: number;            // Limite de datas selecionáveis
  minDate?: string;             // Data mínima selecionável (ISO)
  className?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  onDatesChange,
  label = 'Selecione as datas:',
  maxDates,
  minDate,
  className = ''
}) => {
  const {
    inputValue,
    setInputValue,
    currentMonth,
    parseManualInput,
    isDateSelected,
    previousMonth,
    nextMonth,
  } = useDateSelector(selectedDates);

  // Sincronizar com prop externa
  React.useEffect(() => {
    // Não sobrescrever se forem iguais
    if (JSON.stringify(selectedDates) !== JSON.stringify(selectedDates)) {
      return;
    }
  }, [selectedDates]);

  const handleAddDate = (dateISO: string) => {
    if (maxDates && selectedDates.length >= maxDates) {
      return;
    }

    if (minDate && dateISO < minDate) {
      return;
    }

    if (!selectedDates.includes(dateISO)) {
      const newDates = [...selectedDates, dateISO].sort();
      onDatesChange(newDates);
    }
  };

  const handleRemoveDate = (dateISO: string) => {
    onDatesChange(selectedDates.filter(d => d !== dateISO));
  };

  const handleManualInput = () => {
    const success = parseManualInput(inputValue);
    if (success) {
      // parseManualInput já converte e valida
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = inputValue.trim().match(regex);
      if (match) {
        const [, day, month, year] = match;
        const isoDate = `${year}-${month}-${day}`;
        handleAddDate(isoDate);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualInput();
    }
  };

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: (Date | null)[] = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateToBR = (dateISO: string): string => {
    const [year, month, day] = dateISO.split('-');
    return `${day}/${month}/${year}`;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const calendarDays = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm text-purple-900 mb-3 font-bold">{label}</label>

      {/* Calendário */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
        {/* Header do calendário */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={previousMonth}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={20} className="text-purple-600" />
          </button>
          
          <span className="font-bold text-purple-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} className="text-purple-600" />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDayNames.map((day, idx) => (
            <div key={idx} className="text-center text-xs font-bold text-slate-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dateISO = formatDateToISO(date);
            const selected = isDateSelected(dateISO);
            const isPast = minDate ? dateISO < minDate : date < today;
            const isDisabled = isPast || (maxDates ? selectedDates.length >= maxDates && !selected : false);

            return (
              <button
                key={dateISO}
                type="button"
                onClick={() => selected ? handleRemoveDate(dateISO) : handleAddDate(dateISO)}
                disabled={isDisabled && !selected}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  ${selected 
                    ? 'bg-purple-600 text-white shadow-md scale-105' 
                    : isDisabled
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-700 hover:bg-purple-100 hover:text-purple-700 active:scale-95'
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input manual */}
      <div>
        <label className="block text-xs text-purple-800 mb-2 font-medium">
          Ou digite (DD/MM/AAAA):
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="25/12/2025"
            maxLength={10}
            className="flex-1 p-3 rounded-lg bg-white border-2 border-purple-200 focus:border-purple-500 outline-none text-sm"
          />
          <button
            type="button"
            onClick={handleManualInput}
            disabled={!inputValue}
            className={`h-12 w-12 rounded-lg flex items-center justify-center transition-all border-2 shadow-sm
              ${!inputValue
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 active:scale-95 shadow-purple-200'
              }
            `}
            title="Adicionar data"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Datas selecionadas */}
      {selectedDates.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-3 bg-white/50 rounded-xl border-2 border-purple-100">
          {selectedDates.map(dateISO => (
            <span 
              key={dateISO} 
              className="bg-white border-2 border-purple-100 text-purple-800 text-sm font-bold pl-3 pr-2 py-1.5 rounded-lg flex items-center shadow-sm animate-in zoom-in-50 duration-200"
            >
              {formatDateToBR(dateISO)}
              <button 
                type="button"
                onClick={() => handleRemoveDate(dateISO)} 
                className="ml-2 p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-white/30 rounded-xl border-2 border-dashed border-purple-200 text-center">
          <p className="text-sm text-slate-400 italic">Nenhuma data selecionada</p>
        </div>
      )}
    </div>
  );
};
