import React, { useState } from 'react';
import { X, AlertTriangle, Send, Bug } from 'lucide-react';

interface ReportAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportAppDialog: React.FC<ReportAppDialogProps> = ({ isOpen, onClose }) => {
  const [reportText, setReportText] = useState('');

  if (!isOpen) return null;

  const handleSendReport = () => {
    // Simulação de envio para backend
    alert('Seu report foi enviado com sucesso! Nossa equipe técnica irá analisar.');
    setReportText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2 text-slate-800">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Bug size={20} />
            </div>
            <h2 className="font-bold text-lg">Problema no App</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-slate-50">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-start space-x-3 text-slate-600 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <p>
                Encontrou um erro técnico, lentidão ou algo não está funcionando como deveria? Descreva abaixo para nos ajudar a melhorar.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Descrição do problema</label>
              <textarea 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Ex: O mapa não está carregando, o botão de doar não funciona..."
                className="w-full h-40 p-4 rounded-xl bg-white border border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-slate-900 placeholder:text-slate-500 font-medium resize-none text-sm transition-all"
                autoFocus
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button 
            onClick={handleSendReport}
            disabled={!reportText.trim()}
            className="w-full bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:shadow-none active:scale-95"
          >
            <Send size={18} />
            <span>Enviar Report Técnico</span>
          </button>
        </div>

      </div>
    </div>
  );
};