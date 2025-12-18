import toast from 'react-hot-toast';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Shared function to handle sharing with Web Share API on mobile
 * and clipboard fallback on desktop
 */
export async function shareContent(data: ShareData): Promise<void> {
  // Try native share API (mobile)
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  } else {
    // Fallback: copy to clipboard (desktop)
    try {
      await navigator.clipboard.writeText(data.url);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Erro ao copiar link');
    }
  }
}

/**
 * Generate share data for a company/institution
 */
export function getCompanyShareData(companyId: string, companyName: string): ShareData {
  return {
    title: companyName,
    text: `Confira ${companyName} no mapa`,
    url: `${window.location.origin}/company/${companyId}`,
  };
}

/**
 * Generate share data for a post
 */
export function getPostShareData(postId: string, title: string, description: string): ShareData {
  return {
    title: `Post de ${title}`,
    text: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
    url: `${window.location.origin}/feed?postId=${postId}`,
  };
}
