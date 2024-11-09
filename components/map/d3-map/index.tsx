// components/map/d3-map/index.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { toast } from "sonner";
import { Feature } from 'geojson';
import { Loader2 } from "lucide-react";

interface CountyProperties {
    COUNTY_NAM: string;
    OBJECTID: number;
}

const D3Map: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
    const [status, setStatus] = useState('Starting initialization...');

    useEffect(() => {
        console.log('Component mounted');

        const initializeMap = async () => {
            if (!containerRef.current) {
                console.log('Container not ready yet');
                return;
            }

            try {
                // 1. Load Data
                console.log('Fetching GeoJSON...');
                setStatus('Loading map data...');

                const response = await fetch('/Geojson/kenyan-counties.geojson');
                if (!response.ok) throw new Error('Failed to fetch GeoJSON');

                const geoData = await response.json();
                console.log('GeoJSON loaded:', geoData.features?.length, 'features');

                // 2. Get Container Size
                const container = containerRef.current;
                const { width, height } = container.getBoundingClientRect();
                console.log('Container size:', { width, height });

                // 3. Create SVG
                setStatus('Creating map...');
                d3.select(container).selectAll('svg').remove();

                const svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('max-width', '100%')
                    .style('height', 'auto');

                // 4. Setup Projection
                const projection = d3.geoMercator()
                    .fitSize([width, height], geoData)
                    .center([37.9062, 0.0236])
                    .scale(2300);

                const path = d3.geoPath().projection(projection);

                // 5. Draw Counties
                setStatus('Drawing counties...');
                svg.selectAll('path')
                    .data(geoData.features)
                    .enter()
                    .append('path')
                    .attr('d', path as any)
                    .attr('fill', '#ffffff')
                    .attr('stroke', '#000000')
                    .attr('stroke-width', 0.5)
                    .on('mouseenter', (event, d: Feature<any, CountyProperties>) => {
                        const county = d.properties.COUNTY_NAM;
                        setHoveredCounty(county);
                        d3.select(event.target)
                            .attr('fill', '#60a5fa')
                            .attr('stroke-width', 1);

                        toast.info(county);
                    })
                    .on('mouseleave', (event) => {
                        setHoveredCounty(null);
                        d3.select(event.target)
                            .attr('fill', '#ffffff')
                            .attr('stroke-width', 0.5);
                    });

                setStatus('');
                console.log('Map initialization complete');

            } catch (error) {
                console.error('Map initialization error:', error);
                setStatus('Error loading map');
                toast.error('Failed to load map');
            }
        };

        initializeMap();
    }, []);

    return (
        <div className="relative w-full h-full">
            {status && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <div className="text-sm text-gray-600">{status}</div>
                </div>
            )}
            <div
                ref={containerRef}
                className="w-full h-full bg-white rounded-lg shadow-sm"
            >
                {hoveredCounty && (
                    <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-sm z-20">
                        {hoveredCounty}
                    </div>
                )}
            </div>
        </div>
    );
};

export default D3Map;