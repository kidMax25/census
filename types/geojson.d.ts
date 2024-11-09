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

declare module '*.geojson' {
  import { FeatureCollection } from 'geojson';

  interface KenyaCountyProperties {
    OBJECTID: number;
    AREA: number;
    PERIMETER: number;
    COUNTY3_: number;
    COUNTY3_ID: number;
    COUNTY: string;
    Shape_Leng: number;
    Shape_Area: number;
  }

  const value: FeatureCollection<any, KenyaCountyProperties>;
  export default value;
}