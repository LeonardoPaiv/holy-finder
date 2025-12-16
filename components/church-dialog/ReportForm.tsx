import React from 'react';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react';

interface ReportFormProps {
  churchName: string;
  reportText: string;
  setReportText: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ 
  churchName, 
  reportText, 
  setReportText, 
  onCancel, 
  onSubmit 
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Report */}
      <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-white shrink-0 shadow-sm z-10">
        <button 
          onClick={onCancel} 
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="font-bold text-slate-800 text-lg">Reportar Problema</h3>
      </div>
      
      {/* Form Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex items-start space-x-3 text-orange-700 bg-orange-50 p-4 rounded-xl border border-orange-100">
            <AlertTriangle size={24} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase mb-1 opacity-80">Igreja selecionada</p>
              <p className="text-sm font-bold">{churchName}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Qual é o problema?</label>
            <textarea 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Ex: O horário da missa de domingo mudou para as 10h, o telefone está incorreto..."
              className="w-full h-40 p-4 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-500 font-medium resize-none text-sm transition-all"
              autoFocus
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <button 
          onClick={onSubmit}
          disabled={!reportText.trim()}
          className="w-full bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:shadow-none active:scale-95"
        >
          <Send size={18} />
          <span>Enviar Report</span>
        </button>
      </div>
    </div>
  );
};
