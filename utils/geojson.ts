// utils/geojson.ts
export interface GeometryInterface {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  }
  
  export interface Feature {
    type: 'Feature';
    geometry: GeometryInterface;
    properties: {
      [key: string]: any;
    };
  }
  
  export interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
  }
  
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