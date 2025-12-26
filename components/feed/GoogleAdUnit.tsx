'use client';

import { useEffect, useRef } from 'react';
import { GoogleAdUnitProps } from '@/types';

/**
 * Google AdSense ad unit component
 * Renders a single ad unit and pushes it to the adsbygoogle queue
 */
export default function GoogleAdUnit({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}: GoogleAdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    // Only push the ad once and ensure the element exists
    if (isAdPushed.current || !adRef.current) return;

    // Wait for the next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current && !isAdPushed.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdPushed.current = true;
        }
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {/* Ad Label */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <span className="text-xs text-slate-500 font-medium">Anúncio</span>
      </div>

      {/* Ad Container - with explicit width */}
      <div className="p-4 w-full">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: 'block',
            minHeight: '250px',
            width: '100%'
          }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>
    </div>
  );
}
