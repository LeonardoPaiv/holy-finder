/**
 * Calculate appropriate zoom level for a given radius in kilometers
 * This ensures the entire search radius is visible on the map
 * 
 * @param radiusKm - Search radius in kilometers
 * @param latitude - Latitude for more accurate calculations (optional)
 * @returns Appropriate zoom level (1-18)
 */
export const calculateZoomFromRadius = (radiusKm: number, latitude: number = 0, isMobile: boolean = false): number => {
  // At the equator, each zoom level roughly doubles the visible area
  // We want the radius to fit comfortably in the viewport
  // Assuming viewport shows roughly 2x the radius (diameter + padding)
  
  const metersPerPixel = (radiusKm * (isMobile ? 3 : 0.5)); // 256px is typical tile size
  
  // Adjust for latitude (meters per pixel varies with latitude)
  const latitudeAdjustment = Math.cos(latitude * Math.PI / 180);
  const adjustedMetersPerPixel = metersPerPixel / latitudeAdjustment;
  
  // Calculate zoom level
  // At zoom 0: ~156543 meters per pixel at equator
  // Each zoom level halves the meters per pixel
  const zoom = Math.log2(156543 / adjustedMetersPerPixel);
  
  // Clamp between reasonable values
  // Subtract 1 to give some padding around the circle
  return Math.max(8, Math.min(16, Math.floor(zoom - 1)));
};
