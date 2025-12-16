import React, { useState, useRef } from 'react';
import { Camera, Save, X } from 'lucide-react';

interface CoverImageEditorProps {
    photoUrl?: string;
    onSave: (file: File) => Promise<void>;
    isSaving: boolean;
}

export const CoverImageEditor: React.FC<CoverImageEditorProps> = ({ photoUrl, onSave, isSaving }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo deve ter no máximo 5MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Apenas imagens são permitidas.');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (selectedFile) {
            await onSave(selectedFile);
            setPreview(null);
            setSelectedFile(null);
        }
    };

    const handleCancel = () => {
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">Foto de Capa</label>
            <div 
                onClick={triggerFileInput}
                className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 transition-colors"
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <img
                    src={preview || photoUrl || "https://picsum.photos/800/600?random=1"}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="z-10 bg-white/90 p-3 rounded-full shadow-lg">
                    <Camera size={24} className="text-blue-600" />
                </div>
                <span className="z-10 mt-2 text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded">
                    {preview ? 'Alterar Seleção' : 'Alterar Foto'}
                </span>
            </div>

            {selectedFile && (
                <div className="mt-4 flex gap-2 justify-end">
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <X size={16} />
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Salvar Foto
                    </button>
                </div>
            )}
        </div>
    );
}
