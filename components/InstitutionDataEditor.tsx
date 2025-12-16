import React from 'react';
import { useInstitutionDataEditorViewModel } from './viewmodels/InstitutionDataEditorViewModel';
import { Toaster } from 'react-hot-toast';
import { EditorHeader } from './institution-editor/EditorHeader';
import { CoverImageEditor } from './institution-editor/CoverImageEditor';
import { BasicInfoEditor } from './institution-editor/BasicInfoEditor';
import { ScheduleEditor } from './institution-editor/ScheduleEditor';
import { EventsEditor } from './institution-editor/EventsEditor';

interface InstitutionDataEditorProps {
  onBack: () => void;
}

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
  } = useInstitutionDataEditorViewModel();

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

      {/* Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">

          <CoverImageEditor photoUrl={formData.photo} />

          <BasicInfoEditor 
            formData={formData} 
            setFormData={setFormData} 
            isAdmin={isAdmin} 
            isSaving={isSaving} 
            onSave={saveBasicInfo} 
          />

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
      </div>
    </div>
  );
};