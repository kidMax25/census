// types/map.d.ts

// County properties from GeoJSON
export interface CountyProperties {
    OBJECTID: number;
    ID_: number;
    COUNTY_NAM: string;
    CONST_CODE: number;
    CONSTITUEN: string | null;
    COUNTY_COD: number;
    Shape_Leng: number;
    Shape_Area: number;
  }
  
  // County information from counties.json
  export interface CountyInfo {
    name: string;
    capital: string;
    code: number;
    sub_counties: string[];
  }
  
  // GeoJSON specific types
  export interface CountyFeature {
    type: 'Feature';
    id: number;
    properties: CountyProperties;
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }
  
  export interface CountyCollection {
    type: 'FeatureCollection';
    features: CountyFeature[];
  }
  
  // County mapping type
  export type CountyMapping = Record<string, CountyInfo>;