// components/map/d3-map/index.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Types for our TopoJSON data
interface Topology {
    type: string;
    objects: {
        counties: {
            type: string;
            geometries: Array<{
                type: string;
                properties: {
                    COUNTY_NAM: string;
                    OBJECTID: number;
                };
            }>;
        };
    };
    arcs: number[][][];
    transform?: {
        scale: [number, number];
        translate: [number, number];
    };
}

const D3Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const renderMap = async () => {
            try {
                // Load TopoJSON data
                const response = await fetch('/topojson/kenya.json');
                if (!response.ok) throw new Error('Failed to load map data');

                const topology: Topology = await response.json();
                console.log('TopoJSON loaded');

                // Get container dimensions
                const container = mapRef.current;
                const { width, height } = container.getBoundingClientRect();

                // Clear previous SVG
                d3.select(container).selectAll('svg').remove();

                // Create SVG
                const svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`);

                // Convert TopoJSON to GeoJSON
                const geojson = topojson.feature(
                    topology,
                    topology.objects.counties
                );

                // Create projection
                const projection = d3.geoMercator()
                    .fitSize([width, height], geojson)
                    .center([37.9062, 0.0236]);

                const path = d3.geoPath().projection(projection);

                // Create counties
                const counties = svg.append('g')
                    .attr('class', 'counties')
                    .selectAll('path')
                    .data(geojson.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('fill', '#ffffff')
                    .attr('stroke', '#000')
                    .attr('stroke-width', 0.5)
                    .attr('class', 'county')
                    .on('mouseenter', (event, d: any) => {
                        const county = d.properties.COUNTY_NAM;
                        setHoveredCounty(county);

                        d3.select(event.target)
                            .attr('fill', '#60a5fa')
                            .attr('stroke-width', 1);

                        toast.info(county, {
                            duration: 1000,
                            position: 'bottom-right'
                        });
                    })
                    .on('mouseleave', (event) => {
                        setHoveredCounty(null);
                        d3.select(event.target)
                            .attr('fill', '#ffffff')
                            .attr('stroke-width', 0.5);
                    });

                setLoading(false);

            } catch (err) {
                console.error('Error rendering map:', err);
                setError(err instanceof Error ? err.message : 'Failed to load map');
                setLoading(false);
            }
        };

        renderMap();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            className="relative w-full h-full bg-white rounded-lg shadow-sm"
        >
            {hoveredCounty && (
                <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-sm">
                    {hoveredCounty}
                </div>
            )}
        </div>
    );
};

export default D3Map;