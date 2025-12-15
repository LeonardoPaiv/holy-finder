import { useState, useEffect } from 'react';
import { Company, Event } from '@/types';
import { CompanyService } from '@/services/companyService';
import { useAuth } from '@/hooks/useAuth';
import { WEEKDAYS } from '@/lib/constants';

export const useInstitutionDashboardViewModel = () => {
  const { signOut } = useAuth();
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for new schedule entry
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [currentInputTime, setCurrentInputTime] = useState('');
  const [selectedTimesList, setSelectedTimesList] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
          const companies = await CompanyService.getCompanies(-23.550520, -46.633308);
          if (companies && companies.length > 0) {
              setFormData(companies[0]);
          }
      } catch (e) {
          console.error("Failed to load company for dashboard", e);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await CompanyService.updateCompany(formData);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações.');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const addTimeToDraft = () => {
    if (!currentInputTime) return;
    if (!selectedTimesList.includes(currentInputTime)) {
      const newTimes = [...selectedTimesList, currentInputTime].sort();
      setSelectedTimesList(newTimes);
    }
    setCurrentInputTime('');
  };

  const removeTimeFromDraft = (timeToRemove: string) => {
    setSelectedTimesList(selectedTimesList.filter(t => t !== timeToRemove));
  };

  const handleAddScheduleBlock = () => {
    if (selectedDays.length === 0 || selectedTimesList.length === 0) return;

    // Sort days based on standard week order
    const sortedDays = WEEKDAYS.filter(day => selectedDays.includes(day));
    
    const newEvent: Event = {
        name: 'Missa', // Default name
        days: sortedDays,
        hours: selectedTimesList,
        description: ''
    };

    setFormData(prev => ({
      ...prev,
      missas: [...(prev.missas || []), newEvent]
    }));

    // Reset fields
    setSelectedDays([]);
    setSelectedTimesList([]);
    setCurrentInputTime('');
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      missas: prev.missas?.filter((_, i) => i !== index)
    }));
  };

  return {
    formData,
    setFormData,
    isLoading,
    selectedDays,
    currentInputTime,
    setCurrentInputTime,
    selectedTimesList,
    handleSave,
    handleLogout,
    toggleDay,
    addTimeToDraft,
    removeTimeFromDraft,
    handleAddScheduleBlock,
    removeSchedule,
  };
};
