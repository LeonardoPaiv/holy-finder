import React from 'react';
import { Info, Save, MapPin, Phone, Loader2 } from 'lucide-react';
import { Company, Religions } from '@/types';

interface BasicInfoEditorProps {
    formData: Partial<Company>;
    setFormData: (data: Partial<Company>) => void;
    isAdmin: boolean;
    isSaving: boolean;
    onSave: () => void;
}

export const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({ formData, setFormData, isAdmin, isSaving, onSave }) => {
    return (
        <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 ${!isAdmin ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <Info size={20} className="mr-2 text-blue-500" />
                Informações Básicas
                </h3>
                {isAdmin && (
                    <button 
                        onClick={onSave} 
                        disabled={isSaving}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={16} className="mr-1 animate-spin" /> : <Save size={16} className="mr-1" />}
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nome da Instituição</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-colors"
                disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Religião</label>
              <div className="relative">
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Religions })}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none"
                  disabled={!isAdmin}
                >
                  <option value="" disabled>Selecione uma religião</option>
                  {Object.values(Religions).map((religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
    );
}
