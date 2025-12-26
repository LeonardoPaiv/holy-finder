import { useState } from 'react';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { useInstitutionPost } from '@/components/contexts/InstitutionPostContext';
import { PostService } from '@/services/postService';
import { StorageService } from '@/services/storageService';
import { ModerationImageService } from '@/services/moderationImageService';
import toast from 'react-hot-toast';

export const useCreatePostViewModel = () => {
  const { institution } = useInstitution();
  const { onPostCreated } = useInstitutionPost();
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isModerating, setIsModerating] = useState(false);

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;

    // Validate
    const validation = StorageService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Arquivo inválido');
      return;
    }

    try {
      setIsModerating(true);

      // Moderate image content
      const moderationResult = await ModerationImageService.moderateImage(file);

      if (moderationResult.flagged) {
        const errorMessage = ModerationImageService.getFlaggedMessage(moderationResult.categories);
        toast.error(errorMessage);
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error moderating image:', error);
      toast.error('Erro ao verificar conteúdo da imagem. Tente novamente.');
    } finally {
      setIsModerating(false);
    }
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

      // Upload image using StorageService
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

      // Trigger refresh in feed
      onPostCreated();

    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erro ao criar post. Tente novamente.');
    } finally {
      setIsUploading(false);
      setIsCreating(false);
    }
  };

  const isLoading = isUploading || isCreating;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return {
    description,
    imageFile,
    imagePreview,
    isLoading,
    isUploading,
    isCreating,
    isModerating,
    handleImageSelect,
    handleRemoveImage,
    handleDescriptionChange,
    handleSubmit,
  };
};
