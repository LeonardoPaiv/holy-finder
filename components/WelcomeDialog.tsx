import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Shield, FileText, AlertCircle } from 'lucide-react';

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header with Background Image */}
        <div className="relative h-24 sm:h-32 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 to-blue-600/60" />
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
              Bem-vindo ao Mapa da Fé
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Painel da Instituição
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Introduction */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Estamos felizes em tê-lo conosco! Este painel foi criado para ajudar sua instituição 
              a gerenciar informações, publicar conteúdo e conectar-se com a comunidade.
            </p>
          </div>

          {/* Responsibilities Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                <Shield size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Seus Deveres e Responsabilidades</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Publicar apenas conteúdo apropriado e relacionado à sua instituição religiosa</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Respeitar as normas brasileiras e as diretrizes da comunidade</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Manter informações precisas e atualizadas sobre sua instituição</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Não divulgar conteúdo sensível, ofensivo ou ilegal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                <AlertCircle size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 mb-1 text-sm sm:text-base">Importante</h3>
                <p className="text-xs sm:text-sm text-orange-800">
                  Você é integralmente responsável por todo o conteúdo que publicar. 
                  Violações das diretrizes podem resultar em suspensão ou banimento da conta.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            <FileText size={16} className="text-slate-500 sm:w-[18px] sm:h-[18px]" />
            <Link 
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm sm:text-base text-center"
            >
              Leia os Termos e Condições completos
            </Link>
          </div>

          {/* Action Button */}
          <div className="pt-1 sm:pt-2 pb-2 sm:pb-0">
            <button
              onClick={onClose}
              className="w-full py-3 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              Entendi, vamos começar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
