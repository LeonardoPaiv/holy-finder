import React, { useState } from 'react';
import { useInstitutionDataEditorViewModel } from './viewmodels/InstitutionDataEditorViewModel';
import { Toaster } from 'react-hot-toast';
import { EditorHeader } from './institution-editor/EditorHeader';
import { CoverImageEditor } from './institution-editor/CoverImageEditor';
import { BasicInfoEditor } from './institution-editor/BasicInfoEditor';
import { ScheduleEditor } from './institution-editor/ScheduleEditor';
import { EventsEditor } from './institution-editor/EventsEditor';
import { LocationEditor } from './institution-editor/LocationEditor';
import { Info, MapPin, Clock, Calendar } from 'lucide-react';

interface InstitutionDataEditorProps {
  onBack: () => void;
}

type TabType = 'basic' | 'location' | 'schedule' | 'events';

export const InstitutionDataEditor: React.FC<InstitutionDataEditorProps> = ({ onBack }) => {
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
      <Toaster position="top-center" reverseOrder={false} />
      
      <EditorHeader 
        onBack={onBack} 
        handleLogout={handleLogout} 
        institutionName={formData.name} 
      />

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
              <CoverImageEditor photoUrl={formData.photo} />
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
                selectedDays={eventSelectedDays}
                toggleDay={toggleEventDay}
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