// types/shapefile.d.ts
declare module '*.shp' {
    const content: {
      type: 'FeatureCollection';
      features: Array<{
        type: 'Feature';
        geometry: {
          type: string;
          coordinates: number[][][];
        };
        properties: {
          [key: string]: any;
        };
      }>;
    };
    export default content;
  }
  
  declare module '*.shx' {
    const content: any;
    export default content;
  }
  
  declare module '*.dbf' {
    const content: {
      fields: Array<{
        name: string;
        type: string;
        length: number;
        decimal: number;
      }>;
      records: Array<{
        [key: string]: any;
      }>;
    };
    export default content;
  }
  
  declare module '*.prj' {
    const content: string;
    export default content;
  }
  
  // Extend the existing window interface to include potential shapefile-related globals
  declare global {
    interface Window {
      shp?: any;
    }
  }