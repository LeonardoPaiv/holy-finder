import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Camera, Clock, MapPin, Phone, Info, Plus, Trash2, Check, X, LogOut } from 'lucide-react';
import { Company, Event } from '../types';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';

interface InstitutionDashboardProps {
  onBack: () => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

import { CompanyService } from '../services/companyService';

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({ onBack }) => {
  const router = useRouter();
  // Mock data for editing - now fetched from service
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [isLoading, setIsLoading] = useState(true);

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

  // Local state for new schedule entry
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [currentInputTime, setCurrentInputTime] = useState('');
  const [selectedTimesList, setSelectedTimesList] = useState<string[]>([]);

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
    try {
      await supabase.auth.signOut();
      Cookies.remove('sb-access-token');
      Cookies.remove('sb-refresh-token');
      router.push('/institution/login');
    } catch (error) {
      console.error('Error logging out:', error);
      router.push('/institution/login');
    }
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


  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Painel da Instituição</h2>
            <p className="text-xs text-slate-500">Editando: {formData.name || 'Nova Instituição'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
            title="Sair"
          >
            <LogOut size={20} />
            <span className="hidden md:inline text-sm font-medium">Sair</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span className="hidden md:inline">Salvar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">

          {/* Cover Image Section */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">Foto de Capa</label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 transition-colors">
              <img
                src={formData.photo || "https://picsum.photos/800/600?random=1"}
                alt="Current Cover"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="z-10 bg-white/90 p-3 rounded-full shadow-lg">
                <Camera size={24} className="text-blue-600" />
              </div>
              <span className="z-10 mt-2 text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded">Alterar Foto</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
              <Info size={20} className="mr-2 text-blue-500" />
              Informações Básicas
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nome da Instituição</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Endereço Completo</label>
              <div className="flex items-center space-x-2 bg-slate-50 rounded-lg border border-slate-200 p-3">
                <MapPin size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Telefone / WhatsApp</label>
              <div className="flex items-center space-x-2 bg-slate-50 rounded-lg border border-slate-200 p-3">
                <Phone size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={formData.tel || ''}
                  onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Description is not in Company type, removing or using a custom field if we added it back. 
                For now, I'll remove it to be consistent with types.ts or assume we might want to add it later. 
                If I strictly follow types.ts, I should remove it. 
                But the UI had it. Let's comment it out or leave it if I extend the type locally? 
                No, let's stick to types.ts. I'll remove it.
            */}
          </div>

          {/* Schedules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-orange-500" />
              Horários de Missa/Culto
            </h3>

            {/* List of existing schedules */}
            <div className="space-y-3 mb-6">
              {(!formData.missas || formData.missas.length === 0) && (
                <p className="text-sm text-slate-400 italic">Nenhum horário cadastrado.</p>
              )}
              {formData.missas?.map((event, index) => {
                return (
                  <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex flex-col space-y-2">
                      {/* Row 1: Days */}
                      <span className="font-bold text-slate-800 text-base flex items-center">
                        <Check size={16} className="text-green-500 mr-1.5" />
                        {event.days.join(', ')}
                      </span>
                      {/* Row 2: Times */}
                      <div className="flex flex-wrap gap-2">
                        {event.hours.map((t, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-2.5 py-1 rounded-md shadow-sm">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-slate-500">{event.name}</div>
                    </div>

                    <button
                      onClick={() => removeSchedule(index)}
                      className="p-2 mt-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add new schedule form */}
            <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
              <p className="text-xs font-bold text-blue-800 uppercase mb-4 tracking-wider">Adicionar Novo Horário</p>

              {/* Day Selector */}
              <div className="mb-6">
                <label className="block text-sm text-blue-900 mb-3 font-bold">1. Selecione os dias:</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all border shadow-sm
                          ${isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 transform scale-105'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                          }
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selector */}
              <div className="mb-6">
                <label className="block text-sm text-blue-900 mb-3 font-bold">2. Adicione os horários:</label>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10">
                      <Clock size={24} />
                    </div>
                    <input
                      type="time"
                      value={currentInputTime}
                      onChange={(e) => setCurrentInputTime(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border-2 border-blue-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-xl font-bold transition-all cursor-pointer hover:border-blue-400 shadow-sm appearance-none"
                    />
                  </div>

                  <button
                    onClick={addTimeToDraft}
                    disabled={!currentInputTime}
                    className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all border-2 shadow-sm
                          ${!currentInputTime
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200'
                      }
                        `}
                    title="Adicionar este horário à lista"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Chips of selected times */}
                {selectedTimesList.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-white/50 rounded-xl border border-blue-100/50">
                    {selectedTimesList.map(time => (
                      <span key={time} className="bg-white border-2 border-blue-100 text-blue-800 text-sm font-bold pl-3 pr-2 py-1.5 rounded-lg flex items-center shadow-sm animate-in zoom-in-50 duration-200">
                        {time}
                        <button onClick={() => removeTimeFromDraft(time)} className="ml-2 p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-white/30 rounded-xl border border-dashed border-blue-200 text-center">
                    <p className="text-sm text-slate-400 italic">Selecione uma hora acima e clique no +</p>
                  </div>
                )}
              </div>

              {/* Main Action */}
              <button
                onClick={handleAddScheduleBlock}
                disabled={selectedDays.length === 0 || selectedTimesList.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg
                  ${(selectedDays.length === 0 || selectedTimesList.length === 0)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-green-200'
                  }
                `}
              >
                <Check size={24} strokeWidth={3} />
                <span>Confirmar Horários</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};