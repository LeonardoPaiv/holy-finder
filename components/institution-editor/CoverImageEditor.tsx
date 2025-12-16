import React from 'react';
import { Camera } from 'lucide-react';

interface CoverImageEditorProps {
    photoUrl?: string;
}

export const CoverImageEditor: React.FC<CoverImageEditorProps> = ({ photoUrl }) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">Foto de Capa</label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 transition-colors">
              <img
                src={photoUrl || "https://picsum.photos/800/600?random=1"}
                alt="Current Cover"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="z-10 bg-white/90 p-3 rounded-full shadow-lg">
                <Camera size={24} className="text-blue-600" />
              </div>
              <span className="z-10 mt-2 text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded">Alterar Foto</span>
            </div>
          </div>
    );
}
