/**
 * Feature Flags Configuration
 * 
 * Centralized configuration for feature flags controlled by environment variables.
 * All flags default to false (opt-in approach) for safety.
 */

export const featureFlags = {
  /**
   * Controls whether the donation feature is enabled
   * - When true: Shows donation button in bottom navigation
   * - When false: Hides donation button and related functionality
   */
  donations: process.env.NEXT_PUBLIC_ENABLE_DONATIONS === 'true',

  /**
   * Controls whether ads are displayed in the feed
   * - When true: Shows Google AdSense ads interspersed in the feed
   * - When false: Hides all ads from the feed
   */
  ads: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
} as const;
