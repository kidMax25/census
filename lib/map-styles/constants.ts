// lib/map-styles/constants.ts
export const KENYA_BOUNDS = {
    minLng: 33.9098987,
    maxLng: 41.899578,
    minLat: -4.720556,
    maxLat: 5.506
  };
  
  export const MAP_STYLES = {
    colors: {
      default: '#ffffff',
      hover: '#60a5fa',
      border: '#000000',
    },
    opacity: {
      default: 0.3,
      hover: 0.7,
      border: 0.5,
    }
  } as const;