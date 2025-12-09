import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Phone, AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import { Church } from '../types';

interface ChurchDialogProps {
  church: Church | null;
  onClose: () => void;
}

export const ChurchDialog: React.FC<ChurchDialogProps> = ({ church, onClose }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');

  // Reset state when church changes
  useEffect(() => {
    setIsReporting(false);
    setReportText('');
  }, [church]);

  if (!church) return null;

  const handleSendReport = () => {
    // Aqui seria a integração com backend
    alert('Problema reportado com sucesso! Agradecemos sua contribuição para manter os dados atualizados.');
    setReportText('');
    setIsReporting(false);
  };

  const handleClose = () => {
    setIsReporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div className="relative w-full h-full md:h-auto md:max-w-md bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {isReporting ? (
          // === VIEW: REPORT FORM ===
          <div className="flex flex-col h-full bg-slate-50">
            {/* Header Report */}
            <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-white shrink-0 shadow-sm z-10">
              <button 
                onClick={() => setIsReporting(false)} 
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
                    <p className="text-sm font-bold">{church.name}</p>
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
                onClick={handleSendReport}
                disabled={!reportText.trim()}
                className="w-full bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg disabled:shadow-none active:scale-95"
              >
                <Send size={18} />
                <span>Enviar Report</span>
              </button>
            </div>
          </div>
        ) : (
          // === VIEW: DETAILS ===
          <>
            {/* Header Image */}
            <div className="relative h-48 md:h-40 shrink-0 group">
              <img 
                src={church.image} 
                alt={church.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Report Button */}
              <button 
                onClick={() => setIsReporting(true)}
                className="absolute top-4 right-14 z-20 p-2 bg-black/40 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-sm"
                title="Reportar problema ou informação incorreta"
              >
                <AlertTriangle size={20} />
              </button>

              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-sm"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{church.name}</h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="flex items-start space-x-3 text-slate-600">
                <MapPin className="shrink-0 text-blue-600 mt-1" size={20} />
                <span className="text-sm md:text-base">{church.address}</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-600">
                <Phone className="shrink-0 text-green-600" size={20} />
                <span className="text-sm md:text-base">{church.phone}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 font-semibold text-slate-800 border-b pb-2">
                  <Clock className="text-orange-500" size={20} />
                  <span>Horários de Missa</span>
                </div>
                <ul className="space-y-2">
                  {church.massTimes.map((time, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span>{time}</span>
                      <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Confirmado</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Sobre a Comunidade</h3>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {church.description}
                </p>
              </div>

            </div>
            
            {/* Footer Actions */}
            <div className="p-4 border-t bg-slate-50 shrink-0">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95">
                <MapPin size={18} />
                <span>Como Chegar</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};