import type { FeatureCollection } from "@/types/geojson";
import { validateAndTransformGeoJSON } from "@/utils/geojson";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { load } from "@loaders.gl/core";
import { SHPLoader } from "@loaders.gl/shapefile";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl";
import { toast, Toaster } from "sonner";

const SHAPEFILE_PATH = "/Shapefile/ke_county.shp";
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1Ijoia2lkbWF4IiwiYSI6ImNtMnpjbmdrODA5NXEyaXNhY3hqNzV5ancifQ._jrRnHs-PFuf9WEZYf2RbA";

// Token validation
const validateMapboxToken = (
  token: string | undefined
): { isValid: boolean; error?: string } => {
  if (!token) {
    return { isValid: false, error: "Token is missing" };
  }
  if (!token.startsWith("pk.")) {
    return { isValid: false, error: 'Token must start with "pk."' };
  }
  return { isValid: true };
};

interface MapProps {
  className?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

const Map3D: React.FC<MapProps> = ({
  className,
  initialViewState = {
    longitude: 37.9062, // Kenya's center longitude
    latitude: 0.0236, // Kenya's center latitude
    zoom: 5.5,
    pitch: 0, // Set to 0 for 2D view
    bearing: 0,
  },
}) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: false });
  const [isCheckingEnv, setIsCheckingEnv] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Environment check effect
  useEffect(() => {
    const checkEnvToken = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const status = validateMapboxToken(MAPBOX_TOKEN);
      setTokenStatus(status);

      if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        toast.info("Using fallback Mapbox token", {
          duration: 2000,
          position: "bottom-right",
        });
      }
      setIsCheckingEnv(false);
    };

    checkEnvToken();
  }, []);

  // Load shapefile effect
  useEffect(() => {
    const loadShapefile = async () => {
      try {
        const data = await load(SHAPEFILE_PATH, SHPLoader);
        const validatedData = validateAndTransformGeoJSON(data);
        setGeoData(validatedData);
      } catch (error) {
        console.error("Error loading shapefile:", error);
        toast.error("Error loading shapefile data", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    };

    if (!isCheckingEnv && tokenStatus.isValid) {
      loadShapefile();
    }
  }, [isCheckingEnv, tokenStatus.isValid]);

  const layers = React.useMemo(() => {
    if (!geoData) return [];

    return [
      new GeoJsonLayer({
        id: "kenya-counties",
        data: geoData,
        filled: true,
        extruded: false,
        getFillColor: [255, 255, 255, 20], // Very light fill
        getLineColor: [0, 0, 0, 255], // Black borders
        lineWidthMinPixels: 1,
        lineWidthScale: 1,
        pickable: true,
        onClick: (info) => {
          if (info.object) {
            toast.info(`${info.object.properties.NAME || "Unknown County"}`, {
              duration: 2000,
              position: "bottom-right",
            });
          }
        },
      }),
    ];
  }, [geoData]);

  // Show spinner during initial environment check
  if (isCheckingEnv) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 text-sm font-medium">
          Checking Configuration...
        </p>
      </div>
    );
  }

  // Show error if token validation failed
  if (!tokenStatus.isValid) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 p-4">
        <div className="text-red-600">
          <p className="font-bold">Error: Invalid Mapbox Configuration</p>
          <p className="mt-2">{tokenStatus.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Toaster richColors />
      {isMapLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          dragRotate: false, // Disable rotation
          touchRotate: false, // Disable touch rotation
          keyboard: true, // Enable keyboard controls
          dragPan: true, // Enable panning
          touchZoom: true, // Enable touch zoom
          doubleClickZoom: true, // Enable double click zoom
          maxZoom: 20,
          minZoom: 5,
        }}
        layers={layers}
        style={{ position: "relative", height: "100%", width: "100%" }}
        getTooltip={({ object }) =>
          object && {
            html: `<div class="bg-white px-2 py-1 rounded shadow-sm border">
            ${object.properties.NAME || "Unknown County"}
          </div>`,
          }
        }
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={{
            version: 8,
            name: "Basic",
            sources: {
              "mapbox-streets": {
                type: "raster",
                tiles: [
                  `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
                ],
                tileSize: 256,
              },
            },
            layers: [
              {
                id: "simple-tiles",
                type: "raster",
                source: "mapbox-streets",
                minzoom: 0,
                maxzoom: 22,
                paint: {
                  "raster-opacity": 0.5,
                },
              },
            ],
          }}
          reuseMaps
          onLoad={() => setIsMapLoading(false)}
        />
      </DeckGL>
    </div>
  );
};

export default Map3D;
