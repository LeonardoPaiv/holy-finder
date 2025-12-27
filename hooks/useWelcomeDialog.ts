import { useEffect, useState } from 'react';
import { LOCALSTORAGE } from '@/lib/constants';

/**
 * Hook to manage the welcome dialog display state using localStorage
 * Returns whether the dialog should be shown and a function to mark it as shown
 */
export const useWelcomeDialog = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check localStorage to see if welcome has been shown
    const hasShown = localStorage.getItem(LOCALSTORAGE.DASHBOARD_WELCOME_SHOWN);
    setShouldShow(!hasShown);
    setIsChecking(false);
  }, []);

  const markAsShown = () => {
    localStorage.setItem(LOCALSTORAGE.DASHBOARD_WELCOME_SHOWN, 'true');
    setShouldShow(false);
  };

  return {
    shouldShow,
    isChecking,
    markAsShown,
  };
};
