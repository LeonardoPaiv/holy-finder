import React from 'react';
import { RefreshCw, Building, AlertTriangle } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReligion: () => void;
  onOpenInstitutionArea: () => void;
  onOpenReportApp: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  isOpen, 
  onClose, 
  onOpenReligion, 
  onOpenInstitutionArea,
  onOpenReportApp 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Transparent backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-[45] bg-transparent" 
        onClick={onClose}
      />
      
      {/* Menu Card */}
      <div className="fixed z-[50] bottom-20 right-4 w-64 md:bottom-24 md:left-1/2 md:ml-[60px] bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-200">
        <div className="p-2 space-y-1">
          <button 
            onClick={() => {
              onOpenReligion();
              onClose(); // Close menu when opening sub-dialog
            }}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                <RefreshCw size={18} />
              </div>
              <span className="font-medium text-sm">Mudar religião</span>
            </div>
          </button>
          
          <button 
            onClick={() => {
              onOpenInstitutionArea();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                 <Building size={18} />
              </div>
              <span className="font-medium text-sm">Área Da Instituição</span>
            </div>
          </button>

          <button 
            onClick={() => {
              onOpenReportApp();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                 <AlertTriangle size={18} />
              </div>
              <span className="font-medium text-sm">Reportar Problema</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};