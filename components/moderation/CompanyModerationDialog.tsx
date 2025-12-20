import React from 'react';
import { X, Clock, MapPin, Phone, Calendar, Maximize2, Share2, Power } from 'lucide-react';
import { Company } from '@/types';
import { useCompanyModerationDialogViewModel } from '../viewmodels/CompanyModerationDialogViewModel';
import { ScheduleSection } from '../church-dialog/ScheduleSection';
import { ImagePreviewDialog } from '../ImagePreviewDialog';
import { useState } from 'react';

interface CompanyModerationDialogProps {
  company: Company | null;
  onClose: () => void;
  onStatusChanged?: () => void;
}

export const CompanyModerationDialog: React.FC<CompanyModerationDialogProps> = ({
  company,
  onClose,
  onStatusChanged,
}) => {
  const { localCompany, isTogglingStatus, handleToggleStatus, handleClose } =
    useCompanyModerationDialogViewModel(company, onClose, onStatusChanged);

  const [showPreview, setShowPreview] = useState(false);

  if (!localCompany) return null;

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
        {/* Header Image */}
        <div className="relative h-48 md:h-40 shrink-0 group">
          <img
            src={
              localCompany.photo ||
              'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'
            }
            alt={localCompany.name}
            className="w-full h-full object-cover"
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                localCompany.active
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {localCompany.active ? 'ATIVA' : 'INATIVA'}
            </span>
          </div>

          {/* Toggle Status Button */}
          <button
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            className={`absolute top-4 right-24 z-20 p-2 rounded-full backdrop-blur-md transition-all border border-white/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              localCompany.active
                ? 'bg-orange-500/80 hover:bg-orange-600 text-white'
                : 'bg-green-500/80 hover:bg-green-600 text-white'
            }`}
            title={localCompany.active ? 'Desativar instituição' : 'Ativar instituição'}
          >
            <Power size={20} />
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
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {localCompany.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start space-x-3 text-slate-600">
            <MapPin className="shrink-0 text-blue-600 mt-1" size={20} />
            <span className="text-sm md:text-base">
              {localCompany.address || 'Endereço não informado'}
            </span>
          </div>

          {localCompany.tel && (
            <div className="flex items-center space-x-3 text-slate-600">
              <Phone className="shrink-0 text-green-600" size={20} />
              <span className="text-sm md:text-base">{localCompany.tel}</span>
            </div>
          )}

          <ScheduleSection
            title="Celebrações"
            icon={Clock}
            items={localCompany.missas}
            emptyMessage="Nenhuma celebração cadastrada."
          />

          <ScheduleSection
            title="Eventos"
            icon={Calendar}
            items={localCompany.events}
            emptyMessage="Nenhum evento cadastrado."
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (localCompany.dedicatedMapsUrl) {
                  window.open(localCompany.dedicatedMapsUrl, '_blank');
                } else {
                  const lat = localCompany.geo.coordinates[1];
                  const lng = localCompany.geo.coordinates[0];
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                    '_blank'
                  );
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={18} />
              <span>Rotas</span>
            </button>

            <button
              onClick={() => {
                window.location.href = `/feed?cnpj=${localCompany._id}`;
              }}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              <span>Posts</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: localCompany.name,
                    text: `Confira ${localCompany.name}`,
                    url: window.location.href,
                  });
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
              title="Compartilhar"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <ImagePreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        imageUrl={
          localCompany.photo ||
          'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'
        }
      />
    </div>
  );
};
