import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';

interface EditorHeaderProps {
  onBack: () => void;
  handleLogout: () => void;
  institutionName?: string;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ onBack, handleLogout, institutionName }) => {
  return (
    <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-3">
             <img src="/logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
             <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">Painel da Instituição</h2>
                <p className="text-xs text-slate-500">Editando: {institutionName || 'Nova Instituição'}</p>
             </div>
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
        </div>
      </div>
  );
};
