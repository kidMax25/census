export interface CountyDescription {
    name: string;
    overview: string;
    mainIncomeSources: string[];
    tribes: string[];
    landmarks: string[];
  }
  
  export interface CountyStatistics {
    leader: {
      name: string;
      position: string;
      period: string;
    };
    constituencies: string[];
    gdpContribution: number;
    population: number;
    area: number;
  }
  
  export interface CountyDetails {
    description: CountyDescription;
    statistics: CountyStatistics;
    boundaries: GeoJSON.Feature;
  }
  
  export interface HoverState {
    isHovering: boolean;
    hoverDuration: number;
    isLoading: boolean;
    showCards: boolean;
  }