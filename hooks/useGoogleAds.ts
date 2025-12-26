import { useEffect, useState } from 'react';

interface UseGoogleAdsReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to manage Google AdSense script loading
 * Ensures the AdSense script is loaded only once and provides loading state
 */
export const useGoogleAds = (): UseGoogleAdsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.adsbygoogle) {
      setIsLoaded(true);
      return;
    }

    // Check if script element already exists
    const existingScript = document.querySelector(
      'script[src*="adsbygoogle.js"]'
    );
    
    if (existingScript) {
      setIsLoading(true);
      
      const handleLoad = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };

      const handleError = () => {
        setError(new Error('Failed to load Google AdSense script'));
        setIsLoading(false);
      };

      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);

      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
    }

    // Load the script
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError(new Error('Failed to load Google AdSense script'));
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, isLoading, error };
};
