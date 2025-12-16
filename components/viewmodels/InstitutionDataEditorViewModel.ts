import { useState, useEffect } from 'react';
import { Company, Event } from '@/types';
import { CompanyService } from '@/services/companyService';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { WEEKDAYS } from '@/lib/constants';
import toast from 'react-hot-toast';

export const useInstitutionDataEditorViewModel = () => {
  const { signOut } = useInstitution();
  const { institution, user, setInstitution } = useInstitution();
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for new schedule entry (Missas)
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [currentInputTime, setCurrentInputTime] = useState('');
  const [selectedTimesList, setSelectedTimesList] = useState<string[]>([]);
  const [currentScheduleName, setCurrentScheduleName] = useState('Missa');

  // Local state for new event entry
  const [eventSelectedDays, setEventSelectedDays] = useState<string[]>([]);
  const [eventCurrentInputTime, setEventCurrentInputTime] = useState('');
  const [eventSelectedTimesList, setEventSelectedTimesList] = useState<string[]>([]);
  const [currentEventName, setCurrentEventName] = useState('Evento');

  useEffect(() => {
    if (institution) {
        setFormData(institution);
        setIsLoading(false);
    }
  }, [institution]);

  const saveBasicInfo = async () => {
    if (!institution?._id) return;
    setIsSaving(true);
    try {
      const updated = await CompanyService.updateBasicInfo(institution._id, {
        name: formData.name,
        tel: formData.tel,
        address: formData.address
      });
      setInstitution(updated);
      toast.success('Informações básicas salvas!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar informações básicas.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveMissas = async () => {
    if (!institution?._id) return;
    setIsSaving(true);
    try {
      const updated = await CompanyService.updateMissas(institution._id, formData.missas || []);
      setInstitution(updated);
      toast.success('Horários de missa salvos!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar horários de missa.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveEvents = async () => {
    if (!institution?._id) return;
    setIsSaving(true);
    try {
      const updated = await CompanyService.updateEvents(institution._id, formData.events || []);
      setInstitution(updated);
      toast.success('Eventos salvos!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar eventos.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveLocation = async (coordinates: [number, number]) => {
    if (!institution?._id) return;
    setIsSaving(true);
    try {
      const updated = await CompanyService.updateLocation(institution._id, coordinates);
      setInstitution(updated);
      setFormData(prev => ({ ...prev, geo: updated.geo }));
      toast.success('Localização salva com sucesso!');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Erro ao salvar localização.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveMapsUrl = async (url: string) => {
    if (!institution?._id) return;
    setIsSaving(true);
    try {
      const updated = await CompanyService.updateMapsUrl(institution._id, url);
      setInstitution(updated);
      setFormData(prev => ({ ...prev, dedicatedMapsUrl: updated.dedicatedMapsUrl }));
      toast.success('Link do Google Maps salvo com sucesso!');
    } catch (error) {
      console.error('Error saving maps URL:', error);
      toast.error('Erro ao salvar link do Google Maps.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // --- Missas Logic ---

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
    
    const sortedDays = WEEKDAYS.filter(day => selectedDays.includes(day));
    
    const newEvent: Event = {
        name: currentScheduleName,
        days: sortedDays,
        hours: selectedTimesList,
        description: ''
    };

    setFormData(prev => ({
      ...prev,
      missas: [...(prev.missas || []), newEvent]
    }));

    setSelectedDays([]);
    setSelectedTimesList([]);
    setCurrentInputTime('');
    setCurrentScheduleName('Missa');
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      missas: prev.missas?.filter((_, i) => i !== index)
    }));
  };

  // --- Events Logic ---

  const toggleEventDay = (day: string) => {
    if (eventSelectedDays.includes(day)) {
        setEventSelectedDays(eventSelectedDays.filter(d => d !== day));
    } else {
        setEventSelectedDays([...eventSelectedDays, day]);
    }
  };

  const addEventTimeToDraft = () => {
    if (!eventCurrentInputTime) return;
    if (!eventSelectedTimesList.includes(eventCurrentInputTime)) {
        const newTimes = [...eventSelectedTimesList, eventCurrentInputTime].sort();
        setEventSelectedTimesList(newTimes);
    }
    setEventCurrentInputTime('');
  };

  const removeEventTimeFromDraft = (timeToRemove: string) => {
    setEventSelectedTimesList(eventSelectedTimesList.filter(t => t !== timeToRemove));
  };

  const handleAddEventBlock = () => {
    if (eventSelectedDays.length === 0 || eventSelectedTimesList.length === 0) return;

    const sortedDays = WEEKDAYS.filter(day => eventSelectedDays.includes(day));

    const newEvent: Event = {
        name: currentEventName,
        days: sortedDays,
        hours: eventSelectedTimesList,
        description: ''
    };

    setFormData(prev => ({
        ...prev,
        events: [...(prev.events || []), newEvent]
    }));

    setEventSelectedDays([]);
    setEventSelectedTimesList([]);
    setEventCurrentInputTime('');
    setCurrentEventName('Evento');
  };

  const removeEvent = (index: number) => {
    setFormData(prev => ({
        ...prev,
        events: prev.events?.filter((_, i) => i !== index)
    }));
  };

  const isAdmin = user?.type === 'institution admin';

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    user,
    isAdmin,
    // Missas
    selectedDays,
    currentInputTime,
    setCurrentInputTime,
    selectedTimesList,
    currentScheduleName,
    setCurrentScheduleName,
    toggleDay,
    addTimeToDraft,
    removeTimeFromDraft,
    handleAddScheduleBlock,
    removeSchedule,
    saveMissas,
    // Events
    eventSelectedDays,
    eventCurrentInputTime,
    setEventCurrentInputTime,
    eventSelectedTimesList,
    currentEventName,
    setCurrentEventName,
    toggleEventDay,
    addEventTimeToDraft,
    removeEventTimeFromDraft,
    handleAddEventBlock,
    removeEvent,
    saveEvents,
    // Common
    saveBasicInfo,
    handleLogout,
    // Location
    saveLocation,
    saveMapsUrl,
  };
};
