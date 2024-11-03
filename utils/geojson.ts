// utils/geojson.ts
import type { FeatureCollection, Feature, GeometryInterface } from '../types/geojson';

export const validateAndTransformGeoJSON = (data: any): FeatureCollection => {
  if (Array.isArray(data)) {
    return {
      type: 'FeatureCollection',
      features: data.map(item => ({
        type: 'Feature',
        geometry: {
          type: item.geometry?.type || 'Polygon',
          coordinates: item.geometry?.coordinates || []
        },
        properties: item.properties || {}
      }))
    };
  }

  if (data?.type === 'FeatureCollection') {
    return data;
  }

  if (data?.type === 'Feature') {
    return {
      type: 'FeatureCollection',
      features: [data]
    };
  }

  return {
    type: 'FeatureCollection',
    features: []
  };
};

export const isValidGeoJSON = (data: any): boolean => {
  if (!data) return false;
  
  try {
    if (data.type === 'FeatureCollection') {
      return Array.isArray(data.features);
    }
    
    if (data.type === 'Feature') {
      return !!data.geometry && !!data.geometry.type;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};