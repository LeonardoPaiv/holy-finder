import React, { useState } from 'react';
import { X, Clock, MapPin, Phone, AlertTriangle, Calendar, Maximize2 } from 'lucide-react';
import { Company } from '../types';
import { useChurchDialogViewModel } from './viewmodels/ChurchDialogViewModel';
import { GOOGLE_MAPS_URL } from '../utils/constants';
import { ScheduleSection } from './church-dialog/ScheduleSection';
import { ReportForm } from './church-dialog/ReportForm';
import { ImagePreviewDialog } from './ImagePreviewDialog';

interface ChurchDialogProps {
  church: Company | null;
  onClose: () => void;
}

export const ChurchDialog: React.FC<ChurchDialogProps> = ({ church, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);
  const {
    isReporting,
    setIsReporting,
    reportText,
    setReportText,
    handleSendReport,
    handleClose,
  } = useChurchDialogViewModel(church, onClose);

  if (!church) return null;

  const handleGetDirections = () => {
    if (church.dedicatedMapsUrl) {
      window.open(church.dedicatedMapsUrl, '_blank');
    } else {
      const { coordinates } = church.geo;
      // Leaflet uses [lat, lng] but GeoJSON is [lng, lat]. 
      // Based on previous MapView code, coordinates[1] is lat and coordinates[0] is lng.
      const lat = coordinates[1];
      const lng = coordinates[0];
      window.open(GOOGLE_MAPS_URL(lat, lng), '_blank');
    }
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
          <ReportForm 
            churchName={church.name}
            reportText={reportText}
            setReportText={setReportText}
            onCancel={() => setIsReporting(false)}
            onSubmit={handleSendReport}
          />
        ) : (
          // === VIEW: DETAILS ===
          <>
            {/* Header Image */}
            <div className="relative h-48 md:h-40 shrink-0 group">
              <img 
                src={church.photo || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'} 
                alt={church.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Report Button */}
              <button 
                onClick={() => setIsReporting(true)}
                className="absolute top-4 right-24 z-20 p-2 bg-black/40 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-sm"
                title="Reportar problema ou informação incorreta"
              >
                <AlertTriangle size={20} />
              </button>

              {/* Preview Button */}
              <button 
                onClick={() => setShowPreview(true)}
                className="absolute top-4 right-14 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-sm"
                title="Expandir imagem"
              >
                <Maximize2 size={20} />
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
                <span className="text-sm md:text-base">{church.address || 'Endereço não informado'}</span>
              </div>

              {church.tel && (
                <div className="flex items-center space-x-3 text-slate-600">
                  <Phone className="shrink-0 text-green-600" size={20} />
                  <span className="text-sm md:text-base">{church.tel}</span>
                </div>
              )}

              <ScheduleSection 
                title="Celebrações" 
                icon={Clock} 
                items={church.missas} 
                emptyMessage="Nenhuma celebração cadastrada." 
              />

              <ScheduleSection 
                title="Eventos" 
                icon={Calendar} 
                items={church.events} 
                emptyMessage="Nenhum evento cadastrado." 
              />

            </div>
            
            {/* Footer Actions */}
            <div className="p-4 border-t bg-slate-50 shrink-0 space-y-2">
              <button 
                onClick={handleGetDirections}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <MapPin size={18} />
                <span>Como Chegar</span>
              </button>
              
              <button 
                onClick={() => {
                  window.location.href = `/feed?cnpj=${church._id}`;
                }}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <Calendar size={18} />
                <span>Ver Postagens</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      <ImagePreviewDialog 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        imageUrl={church.photo || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'} 
      />
    </div>
  );
};