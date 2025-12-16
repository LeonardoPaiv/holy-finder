import React from 'react';
import { Calendar, Save, Check, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Event } from '@/types';
import { WEEKDAYS } from '@/lib/constants';
import { TimePicker } from '../TimePicker';

interface EventsEditorProps {
    events: Event[];
    isSaving: boolean;
    onSave: () => void;
    onRemove: (index: number) => void;
    // New event state
    currentEventName: string;
    setCurrentEventName: (name: string) => void;
    selectedDays: string[];
    toggleDay: (day: string) => void;
    currentInputTime: string;
    setCurrentInputTime: (time: string) => void;
    selectedTimesList: string[];
    addTimeToDraft: () => void;
    removeTimeFromDraft: (time: string) => void;
    handleAddEventBlock: () => void;
}

export const EventsEditor: React.FC<EventsEditorProps> = ({
    events, isSaving, onSave, onRemove,
    currentEventName, setCurrentEventName,
    selectedDays, toggleDay,
    currentInputTime, setCurrentInputTime,
    selectedTimesList, addTimeToDraft, removeTimeFromDraft,
    handleAddEventBlock
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <Calendar size={20} className="mr-2 text-purple-500" />
                Eventos Especiais
                </h3>
                <button 
                    onClick={onSave} 
                    disabled={isSaving}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 size={16} className="mr-1 animate-spin" /> : <Save size={16} className="mr-1" />}
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>

            {/* List of existing events */}
            <div className="space-y-3 mb-6">
              {(!events || events.length === 0) && (
                <p className="text-sm text-slate-400 italic">Nenhum evento cadastrado.</p>
              )}
              {events?.map((event, index) => {
                return (
                  <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm font-bold text-purple-600">{event.name}</div>
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
                    </div>

                    <button
                      onClick={() => onRemove(index)}
                      className="p-2 mt-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add new event form */}
            <div className="bg-purple-50 rounded-xl p-4 md:p-6 border border-purple-100">
              <p className="text-xs font-bold text-purple-800 uppercase mb-4 tracking-wider">Adicionar Novo Evento</p>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm text-purple-900 mb-2 font-bold">Nome do Evento:</label>
                <input
                    type="text"
                    value={currentEventName}
                    onChange={(e) => setCurrentEventName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white border border-purple-200 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Day Selector */}
              <div className="mb-6">
                <label className="block text-sm text-purple-900 mb-3 font-bold">1. Selecione os dias:</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all border shadow-sm
                          ${isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200 transform scale-105'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300 hover:text-purple-600'
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
                <label className="block text-sm text-purple-900 mb-3 font-bold">2. Adicione os horários:</label>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 group">
                    <TimePicker
                      value={currentInputTime}
                      onChange={setCurrentInputTime}
                    />
                  </div>

                  <button
                    onClick={addTimeToDraft}
                    disabled={!currentInputTime}
                    className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all border-2 shadow-sm
                          ${!currentInputTime
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                        : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 active:scale-95 shadow-purple-200'
                      }
                        `}
                    title="Adicionar este horário à lista"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Chips of selected times */}
                {selectedTimesList.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-white/50 rounded-xl border border-purple-100/50">
                    {selectedTimesList.map(time => (
                      <span key={time} className="bg-white border-2 border-purple-100 text-purple-800 text-sm font-bold pl-3 pr-2 py-1.5 rounded-lg flex items-center shadow-sm animate-in zoom-in-50 duration-200">
                        {time}
                        <button onClick={() => removeTimeFromDraft(time)} className="ml-2 p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-white/30 rounded-xl border border-dashed border-purple-200 text-center">
                    <p className="text-sm text-slate-400 italic">Selecione uma hora acima e clique no +</p>
                  </div>
                )}
              </div>

              {/* Main Action */}
              <button
                onClick={handleAddEventBlock}
                disabled={selectedDays.length === 0 || selectedTimesList.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg
                  ${(selectedDays.length === 0 || selectedTimesList.length === 0)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-green-200'
                  }
                `}
              >
                <Check size={24} strokeWidth={3} />
                <span>Confirmar Evento</span>
              </button>

            </div>
          </div>
    );
}
