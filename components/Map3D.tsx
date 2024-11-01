import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { load } from '@loaders.gl/core';
import { SHPLoader } from '@loaders.gl/shapefile';

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

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_TOKEN;

const Map3D: React.FC<MapProps> = ({
  className,
  initialViewState = {
    longitude: 37.9062,
    latitude: 0.0236,
    zoom: 5.5,
    pitch: 45,
    bearing: 0
  }
}) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const loadShapefile = async () => {
      try {
        const data = await load('/Shapefile/ke_county.shp', SHPLoader);
        setGeoData(data);
      } catch (error) {
        console.error('Error loading shapefile:', error);
      }
    };

    loadShapefile();
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: 'kenya-counties',
      data: geoData,
      filled: true,
      extruded: true,
      getFillColor: [169, 222, 249, 180],
      getLineColor: [0, 0, 0],
      getElevation: 1000,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      pickable: true,
      onClick: (info: any) => {
        if (info.object) {
          console.log('Clicked county:', info.object.properties);
        }
      },
      updateTriggers: {
        getFillColor: geoData
      }
    })
  ];

  return (
    <div className={className || 'h-screen w-full'}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v10"
        />
      </DeckGL>
    </div>
  );
};

export default Map3D;