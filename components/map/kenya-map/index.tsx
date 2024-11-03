// components/map/kenya-map/index.tsx
"use client";

import type { CountyCollection, CountyInfo, CountyMapping } from "@/types/map";
import { Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMapGL, {
  Layer,
  MapLayerMouseEvent,
  MapRef,
  Source,
} from "react-map-gl";
import { toast } from "sonner";

interface KenyaMapProps {
  className?: string;
}

// Constants
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1Ijoia2lkbWF4IiwiYSI6ImNtMnpjbmdrODA5NXEyaXNhY3hqNzV5ancifQ._jrRnHs-PFuf9WEZYf2RbA";

const KENYA_BOUNDS: [[number, number], [number, number]] = [
  [33.9098987, -4.720556], // Southwest coordinates
  [41.899578, 5.506], // Northeast coordinates
];

const INITIAL_VIEW_STATE = {
  latitude: 0.0236,
  longitude: 37.9062,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
  bounds: KENYA_BOUNDS,
  fitBoundsOptions: {
    padding: 20,
  },
};

// Loading component
const MapLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

// Layer styles
const layerStyles = {
  fill: {
    id: "county-fills",
    type: "fill" as const,
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0.3,
    },
  },
  outline: {
    id: "county-borders",
    type: "line" as const,
    paint: {
      "line-color": "#000000",
      "line-width": 1,
      "line-opacity": 0.5,
    },
  },
  label: {
    id: "county-labels",
    type: "symbol" as const,
    layout: {
      "text-field": ["get", "COUNTY_NAM"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": false,
      "text-padding": 2,
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
  },
};

const KenyaMap: React.FC<KenyaMapProps> = ({ className }) => {
  const mapRef = useRef<MapRef>(null);
  const [hoveredCountyId, setHoveredCountyId] = useState<number | null>(null);
  const [mapData, setMapData] = useState<CountyCollection | null>(null);
  const [countyData, setCountyData] = useState<CountyMapping>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load county information
  useEffect(() => {
    const loadCountyData = async () => {
      try {
        const response = await fetch("/County Information/counties.json");
        if (!response.ok) throw new Error("Failed to load county data");

        const data: CountyInfo[] = await response.json();
        const mapping: CountyMapping = {};

        data.forEach((county) => {
          mapping[county.name.toLowerCase()] = county;
        });

        setCountyData(mapping);
        console.log("County data loaded:", mapping);
      } catch (err) {
        console.error("Error loading county data:", err);
        toast.error("Failed to load county information");
      }
    };

    loadCountyData();
  }, []);

  // Load GeoJSON map data
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch("/Geojson/kenyan-counties.geojson");
        if (!response.ok) throw new Error("Failed to load map data");

        const data = await response.json();
        if (data.type !== "FeatureCollection") {
          throw new Error("Invalid GeoJSON format");
        }

        console.log("Map data loaded:", data);
        setMapData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading map:", err);
        setError(err instanceof Error ? err.message : "Failed to load map");
        setIsLoading(false);
      }
    };

    loadMapData();
  }, []);

  // Check token source
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      toast.info("Using fallback Mapbox token", {
        duration: 3000,
      });
      console.log("Using fallback token");
    }
  }, []);

  const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
    if (event.features && event.features[0]) {
      const feature = event.features[0];
      const countyName = feature.properties.COUNTY_NAM;

      if (feature.properties?.OBJECTID) {
        setHoveredCountyId(feature.properties.OBJECTID);

        console.log("Hover detected:", {
          objectId: feature.properties.OBJECTID,
          countyName: countyName,
          properties: feature.properties,
        });

        if (countyName) {
          toast.info(`${countyName} County`, {
            duration: 1000,
            position: "bottom-right",
          });
        }
      }
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredCountyId(null);
  }, []);

  if (isLoading) return <MapLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 p-4">
        <div className="text-red-600">
          <p className="font-bold">Error loading map</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[500px] ${className}`}>
      {mapData && (
        <ReactMapGL
          ref={mapRef}
          reuseMaps
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={INITIAL_VIEW_STATE}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          interactiveLayerIds={["county-fills"]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          maxBounds={KENYA_BOUNDS}
          minZoom={5}
          maxZoom={12}
        >
          <Source id="counties" type="geojson" data={mapData} generateId={true}>
            <Layer
              {...layerStyles.fill}
              paint={{
                "fill-color": [
                  "case",
                  ["==", ["get", "OBJECTID"], hoveredCountyId],
                  "#60a5fa",
                  "#ffffff",
                ],
                "fill-opacity": [
                  "case",
                  ["==", ["get", "OBJECTID"], hoveredCountyId],
                  0.7,
                  0.3,
                ],
              }}
            />
            <Layer {...layerStyles.outline} />
            <Layer {...layerStyles.label} />
          </Source>
        </ReactMapGL>
      )}
    </div>
  );
};

export default KenyaMap;
