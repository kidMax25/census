// types/geojson.d.ts
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