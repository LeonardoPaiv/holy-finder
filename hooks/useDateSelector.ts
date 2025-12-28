import { useState } from 'react';

/**
 * Hook para gerenciar a lógica do seletor de datas
 * @param initialDates - Array de datas iniciais no formato ISO (YYYY-MM-DD)
 */
export const useDateSelector = (initialDates: string[] = []) => {
  const [selectedDates, setSelectedDates] = useState<string[]>(initialDates);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /**
   * Adiciona uma data ao array de datas selecionadas
   * @param dateISO - Data no formato ISO (YYYY-MM-DD)
   */
  const addDate = (dateISO: string) => {
    if (!selectedDates.includes(dateISO)) {
      const newDates = [...selectedDates, dateISO].sort();
      setSelectedDates(newDates);
    }
  };

  /**
   * Remove uma data do array de datas selecionadas
   * @param dateISO - Data no formato ISO (YYYY-MM-DD)
   */
  const removeDate = (dateISO: string) => {
    setSelectedDates(selectedDates.filter(d => d !== dateISO));
  };

  /**
   * Converte input manual (DD/MM/YYYY) para formato ISO e adiciona
   * @param input - Data no formato DD/MM/YYYY
   * @returns true se válido e adicionado, false caso contrário
   */
  const parseManualInput = (input: string): boolean => {
    // Remove espaços e valida formato DD/MM/YYYY
    const cleaned = input.trim();
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = cleaned.match(regex);

    if (!match) {
      return false;
    }

    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Validar ranges
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return false;
    }

    // Criar data e validar se é válida
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1) {
      return false;
    }

    // Converter para ISO (YYYY-MM-DD)
    const isoDate = `${year}-${month}-${day}`;
    addDate(isoDate);
    setInputValue('');
    return true;
  };

  /**
   * Verifica se uma data está selecionada
   * @param dateISO - Data no formato ISO (YYYY-MM-DD)
   */
  const isDateSelected = (dateISO: string): boolean => {
    return selectedDates.includes(dateISO);
  };

  /**
   * Limpa todas as datas selecionadas
   */
  const clearDates = () => {
    setSelectedDates([]);
  };

  /**
   * Navega para o mês anterior
   */
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  /**
   * Navega para o próximo mês
   */
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return {
    selectedDates,
    setSelectedDates,
    inputValue,
    setInputValue,
    currentMonth,
    setCurrentMonth,
    addDate,
    removeDate,
    parseManualInput,
    isDateSelected,
    clearDates,
    previousMonth,
    nextMonth,
  };
};
