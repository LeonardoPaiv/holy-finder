import React, { useState } from 'react';
import { useInstitutionDataEditorViewModel } from './viewmodels/InstitutionDataEditorViewModel';
import { CoverImageEditor } from './institution-editor/CoverImageEditor';
import { BasicInfoEditor } from './institution-editor/BasicInfoEditor';
import { ScheduleEditor } from './institution-editor/ScheduleEditor';
import { EventsEditor } from './institution-editor/EventsEditor';
import dynamic from 'next/dynamic';

const LocationEditor = dynamic(
  () => import('./institution-editor/LocationEditor').then((mod) => mod.LocationEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
        Carregando mapa...
      </div>
    )
  }
);
import { Info, MapPin, Clock, Calendar } from 'lucide-react';

type TabType = 'basic' | 'location' | 'schedule' | 'events';

export const InstitutionDataEditor = () => {
  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
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
    eventType,
    setEventType,
    eventSelectedDays,
    eventSelectedDates,
    setEventSelectedDates,
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
    // Location
    saveLocation,
    saveMapsUrl,
    saveCoverImage,
    deletePhoto,
  } = useInstitutionDataEditorViewModel();

  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const tabs = [
    { id: 'basic', label: 'Informações', icon: Info },
    { id: 'location', label: 'Localização', icon: MapPin },
    { id: 'schedule', label: 'Celebrações', icon: Clock },
    { id: 'events', label: 'Eventos', icon: Calendar },
  ] as const;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-10 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between md:justify-start md:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 transition-colors relative ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span className={`ml-2 text-sm font-medium hidden md:inline ${isActive ? 'text-blue-900' : ''}`}>
                  {tab.label}
                </span>
                {/* Mobile Label (Screen Reader Only or Tooltip could be added) */}
                <span className="sr-only">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">

          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <CoverImageEditor 
                photoUrl={formData.photo} 
                onSave={saveCoverImage}
                onDelete={deletePhoto}
                isSaving={isSaving}
                isAdmin={isAdmin}
              />
              <BasicInfoEditor 
                formData={formData} 
                setFormData={setFormData} 
                isAdmin={isAdmin} 
                isSaving={isSaving} 
                onSave={saveBasicInfo} 
              />
            </div>
          )}

          {activeTab === 'location' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <LocationEditor 
                initialCoordinates={formData.geo?.coordinates || [-46.633308, -23.550520]} // Default to SP if missing
                initialMapsUrl={formData.dedicatedMapsUrl}
                onSaveLocation={saveLocation}
                onSaveMapsUrl={saveMapsUrl}
                isSaving={isSaving}
              />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <ScheduleEditor 
                missas={formData.missas || []}
                isAdmin={isAdmin}
                isSaving={isSaving}
                onSave={saveMissas}
                onRemove={removeSchedule}
                currentScheduleName={currentScheduleName}
                setCurrentScheduleName={setCurrentScheduleName}
                selectedDays={selectedDays}
                toggleDay={toggleDay}
                currentInputTime={currentInputTime}
                setCurrentInputTime={setCurrentInputTime}
                selectedTimesList={selectedTimesList}
                addTimeToDraft={addTimeToDraft}
                removeTimeFromDraft={removeTimeFromDraft}
                handleAddScheduleBlock={handleAddScheduleBlock}
              />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <EventsEditor 
                events={formData.events || []}
                isSaving={isSaving}
                onSave={saveEvents}
                onRemove={removeEvent}
                currentEventName={currentEventName}
                setCurrentEventName={setCurrentEventName}
                eventType={eventType}
                setEventType={setEventType}
                selectedDays={eventSelectedDays}
                toggleDay={toggleEventDay}
                selectedDates={eventSelectedDates}
                setSelectedDates={setEventSelectedDates}
                currentInputTime={eventCurrentInputTime}
                setCurrentInputTime={setEventCurrentInputTime}
                selectedTimesList={eventSelectedTimesList}
                addTimeToDraft={addEventTimeToDraft}
                removeTimeFromDraft={removeEventTimeFromDraft}
                handleAddEventBlock={handleAddEventBlock}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};