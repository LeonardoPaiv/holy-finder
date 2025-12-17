'use client';

import { Loader2 } from 'lucide-react';
import { useCreatePostViewModel } from '@/components/viewmodels/CreatePostViewModel';
import ImageUpload from './ImageUpload';

export default function CreatePostTab() {
  const {
    description,
    setDescription,
    imagePreview,
    isLoading,
    isUploading,
    isCreating,
    handleImageSelect,
    handleRemoveImage,
    handleSubmit,
  } = useCreatePostViewModel();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Criar Novo Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Imagem *
            </label>
            <ImageUpload
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva uma descrição para o post..."
              rows={6}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              {description.length} caracteres
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !imagePreview || !description.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{isUploading ? 'Enviando imagem...' : 'Criando post...'}</span>
              </>
            ) : (
              <span>Publicar Post</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
