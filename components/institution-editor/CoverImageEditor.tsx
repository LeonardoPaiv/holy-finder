import React, { useState, useRef } from 'react';
import { Camera, Save, X, Trash2, Maximize2 } from 'lucide-react';
import { ImagePreviewDialog } from '../ImagePreviewDialog';
import toast from 'react-hot-toast';

interface CoverImageEditorProps {
    photoUrl?: string;
    onSave: (file: File) => Promise<void>;
    onDelete?: () => Promise<void>;
    isSaving: boolean;
    isAdmin?: boolean;
}

export const CoverImageEditor: React.FC<CoverImageEditorProps> = ({ photoUrl, onSave, onDelete, isSaving, isAdmin }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAdmin) {
            toast.error('Apenas administradores podem alterar a foto de capa.');
            return;
        }
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
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            await onDelete();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
        if (!selectedFile && !showFullPreview) {
             fileInputRef.current?.click();
        }
    };

    const openPreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoUrl || preview) {
            setShowFullPreview(true);
        }
    };

    return (
        <>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-slate-700">Foto de Capa</label>
                    {isAdmin && photoUrl && !selectedFile && (
                        <button 
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={14} />
                            Excluir Foto
                        </button>
                    )}
                </div>
                
                <div 
                    className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 transition-colors"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    
                    {/* Image Display */}
                    <img
                        src={preview || photoUrl || "https://picsum.photos/800/600?random=1"}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        onClick={triggerFileInput}
                    />

                    {/* Actions Overlay */}
                    <div className="z-10 flex flex-col items-center gap-2 pointer-events-none">
                        {!selectedFile && (
                            <>
                                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                    <Camera size={24} className="text-blue-600" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded">
                                    {photoUrl ? 'Alterar Foto' : 'Adicionar Foto'}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Preview Button (Top Right) */}
                    {(photoUrl || preview) && (
                        <button
                            onClick={openPreview}
                            className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            title="Expandir visualização"
                        >
                            <Maximize2 size={16} />
                        </button>
                    )}
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

            <ImagePreviewDialog 
                isOpen={showFullPreview} 
                onClose={() => setShowFullPreview(false)} 
                imageUrl={preview || photoUrl} 
            />
        </>
    );
}
