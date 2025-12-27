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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with Background Image */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 to-blue-500/60" />
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="absolute bottom-4 left-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Bem-vindo ao Mapa da Fé
            </h2>
            <p className="text-white/90 text-sm mt-1">
              Painel da Instituição
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="space-y-3">
            <p className="text-slate-700 leading-relaxed">
              Estamos felizes em tê-lo conosco! Este painel foi criado para ajudar sua instituição 
              a gerenciar informações, publicar conteúdo e conectar-se com a comunidade.
            </p>
          </div>

          {/* Responsibilities Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">Seus Deveres e Responsabilidades</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Publicar apenas conteúdo apropriado e relacionado à sua instituição religiosa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Respeitar as normas brasileiras e as diretrizes da comunidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Manter informações precisas e atualizadas sobre sua instituição</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Não divulgar conteúdo sensível, ofensivo ou ilegal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 mb-1">Importante</h3>
                <p className="text-sm text-orange-800">
                  Você é integralmente responsável por todo o conteúdo que publicar. 
                  Violações das diretrizes podem resultar em suspensão ou banimento da conta.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Link */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <FileText size={18} className="text-slate-500" />
            <Link 
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Leia os Termos e Condições completos
            </Link>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Entendi, vamos começar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
