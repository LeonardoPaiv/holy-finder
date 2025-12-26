import { api } from '@/lib/apiClient';

export interface ModerationCategories {
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  'self-harm': boolean;
  'sexual/minors': boolean;
  'hate/threatening': boolean;
  'violence/graphic': boolean;
  'self-harm/intent': boolean;
  'self-harm/instructions': boolean;
  'harassment/threatening': boolean;
  violence: boolean;
}

export interface ModerationCategoryScores {
  sexual: number;
  hate: number;
  harassment: number;
  'self-harm': number;
  'sexual/minors': number;
  'hate/threatening': number;
  'violence/graphic': number;
  'self-harm/intent': number;
  'self-harm/instructions': number;
  'harassment/threatening': number;
  violence: number;
}

export interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategories;
  category_scores: ModerationCategoryScores;
}

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ModerationImageService = {
  /**
   * Moderate image content using OpenAI Moderation API
   * @param file - Image file to moderate
   * @returns Moderation result
   */
  moderateImage: async (file: File): Promise<ModerationResult> => {
    try {
      // Convert file to base64 data URL
      const base64Image = await fileToBase64(file);

      // Call moderation API with base64 data URL
      const response = await api.post('/api/moderation/image', {
        image: base64Image, // Send as data URL (e.g., data:image/jpeg;base64,...)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to moderate image');
      }

      const result: ModerationResult = await response.json();
      return result;

    } catch (error) {
      console.error('Error moderating image:', error);
      throw error;
    }
  },

  /**
   * Get human-readable message for flagged content
   * @param categories - Moderation categories
   * @returns Error message
   */
  getFlaggedMessage: (categories: ModerationCategories): string => {
    const flaggedCategories = Object.entries(categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category);

    if (flaggedCategories.length === 0) {
      return 'Conteúdo sensível detectado';
    }

    return `Esta imagem contém conteúdo inapropriado e não pode ser enviada. Por favor, escolha outra imagem.`;
  },
};
