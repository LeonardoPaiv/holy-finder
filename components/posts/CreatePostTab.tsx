'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { PostService } from '@/services/postService';
import { StorageService } from '@/services/storageService';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function CreatePostTab() {
  const { institution } = useInstitution();
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = StorageService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Arquivo inválido');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !description.trim()) {
      toast.error('Por favor, adicione uma imagem e descrição');
      return;
    }

    if (!institution?._id) {
      toast.error('Instituição não encontrada');
      return;
    }

    try {
      setIsUploading(true);

      // Upload image using PostService
      const { url } = await StorageService.uploadPostImage(imageFile, institution._id);

      setIsUploading(false);
      setIsCreating(true);

      // Create post using PostService
      await PostService.createPost(institution._id, {
        description: description.trim(),
        photo: url
      });

      toast.success('Post criado com sucesso!');
      
      // Reset form
      setDescription('');
      setImageFile(null);
      setImagePreview(null);

    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erro ao criar post. Tente novamente.');
    } finally {
      setIsUploading(false);
      setIsCreating(false);
    }
  };

  const isLoading = isUploading || isCreating;

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
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-slate-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-slate-400 mb-3" />
                  <p className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Clique para fazer upload</span>
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP (máx. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  disabled={isLoading}
                />
              </label>
            ) : (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            )}
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
            disabled={isLoading || !imageFile || !description.trim()}
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
