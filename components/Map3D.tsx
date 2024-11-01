import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { load } from '@loaders.gl/core';
import { SHPLoader } from '@loaders.gl/shapefile';
import { validateAndTransformGeoJSON, FeatureCollection } from '../utils/geojson';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

const SHAPEFILE_PATH = '/Shapefile/ke_county.shp';
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoia2lkbWF4IiwiYSI6ImNtMnpjbmdrODA5NXEyaXNhY3hqNzV5ancifQ._jrRnHs-PFuf9WEZYf2RbA';

// Detailed token validation
const validateMapboxToken = (token: string | undefined): { isValid: boolean; error?: string } => {
  if (!token) {
    return { isValid: false, error: 'Token is missing' };
  }

  if (token.includes('\n') || token.includes('\r')) {
    return { isValid: false, error: 'Token contains line breaks' };
  }

  if (token.includes(' ')) {
    return { isValid: false, error: 'Token contains spaces' };
  }

  if (!token.startsWith('pk.')) {
    return { isValid: false, error: 'Token must start with "pk."' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Token format is invalid' };
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

const KENYA_BOUNDS = {
  minLng: 33.9098987,
  maxLng: 41.899578,
  minLat: -4.720556,
  maxLat: 5.506
};

const Map3D: React.FC<MapProps> = ({
  className,
  initialViewState = {
    longitude: 37.9062,
    latitude: 0.0236,
    zoom: 5.5,
    pitch: 20,
    bearing: 0,
    bounds: [
      [KENYA_BOUNDS.minLng, KENYA_BOUNDS.minLat],
      [KENYA_BOUNDS.maxLng, KENYA_BOUNDS.maxLat]
    ]
  }
}) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [tokenStatus, setTokenStatus] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [isCheckingEnv, setIsCheckingEnv] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const layers = React.useMemo(() => {
    if (!geoData) return [];

    return [
      new GeoJsonLayer({
        id: 'kenya-counties',
        data: geoData,
        filled: true,
        extruded: false, // Set to false to remove 3D effect
        getFillColor: [255, 255, 255, 20], // Very light fill
        getLineColor: [0, 0, 0, 255], // Solid black lines for borders
        lineWidthMinPixels: 1,
        lineWidthScale: 1,
        pickable: true,
        onClick: (info) => {
          if (info.object) {
            toast.info(`${info.object.properties.NAME || 'Unknown County'}`, {
              duration: 2000,
              position: 'bottom-right',
            });
          }
        },
        updateTriggers: {
          getFillColor: geoData,
        }
      })
    ];
  }, [geoData]);

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
          maxZoom: 12,
          minZoom: 5,
          maxPitch: 0, // Restrict to 2D view
          dragRotate: false, // Disable rotation
          bounds: {
            west: KENYA_BOUNDS.minLng,
            east: KENYA_BOUNDS.maxLng,
            south: KENYA_BOUNDS.minLat,
            north: KENYA_BOUNDS.maxLat
          },
          boundsControlOptions: {
            bounds: [
              [KENYA_BOUNDS.minLng, KENYA_BOUNDS.minLat],
              [KENYA_BOUNDS.maxLng, KENYA_BOUNDS.maxLat]
            ],
            padding: 20
          }
        }}
        layers={layers}
        style={{ position: 'relative', height: '100%', width: '100%' }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={{
            version: 8,
            sources: {
              'kenya-base': {
                type: 'raster',
                tiles: [`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                tileSize: 256,
              }
            },
            layers: [
              {
                id: 'background',
                type: 'background',
                paint: {
                  'background-color': '#ffffff'
                }
              },
              {
                id: 'kenya-base-layer',
                type: 'raster',
                source: 'kenya-base',
                paint: {
                  'raster-opacity': 0.3, // Very light background
                  'raster-contrast': 0,
                  'raster-brightness-min': 1
                }
              }
            ]
          }}
          reuseMaps
          onLoad={() => setIsMapLoading(false)}
          renderWorldCopies={false} // Prevent world copies
          maxBounds={[
            [KENYA_BOUNDS.minLng - 1, KENYA_BOUNDS.minLat - 1],
            [KENYA_BOUNDS.maxLng + 1, KENYA_BOUNDS.maxLat + 1]
          ]}
        />
      </DeckGL>
    </div>
  );
};

export default Map3D;