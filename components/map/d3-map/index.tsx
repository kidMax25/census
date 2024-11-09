import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import GeoJSON with correct type
import kenyaCounties from '@/public/Geojson/kenya.geojson';

// Define the properties based on your GeoJSON structure
interface CountyProperties {
    OBJECTID: number;
    AREA: number;
    PERIMETER: number;
    COUNTY3_: number;
    COUNTY3_ID: number;
    COUNTY: string;
    Shape_Leng: number;
    Shape_Area: number;
}

const D3Map: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('Starting');
    const [mounted, setMounted] = useState(false);
    const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

    // Handle initial mounting
    useEffect(() => {
        console.log('Mount effect running');
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const updateProgress = (newStage: string, newProgress: number) => {
        console.log(`Updating state: ${newStage} - ${newProgress}%`);
        setStage(newStage);
        setProgress(newProgress);
    };

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        const container = containerRef.current;
        console.log('Starting map initialization');

        const initMap = async () => {
            try {
                updateProgress('Preparing container', 10);
                const { width, height } = container.getBoundingClientRect();
                console.log('Container dimensions:', { width, height });

                if (width === 0 || height === 0) {
                    throw new Error('Invalid container dimensions');
                }

                updateProgress('Processing GeoJSON', 30);
                // Log the first feature to verify data structure
                console.log('Sample county:', kenyaCounties.features[0]?.properties);

                // Clean up existing SVG
                if (svgRef.current) {
                    svgRef.current.remove();
                }

                // Create SVG
                updateProgress('Creating SVG', 50);
                const svg = d3.select(container)
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('viewBox', `0 0 ${width} ${height}`);

                svgRef.current = svg.node();

                // Create projection
                updateProgress('Creating projection', 70);
                const projection = d3.geoMercator()
                    .fitSize([width, height], kenyaCounties)
                    .center([37.9062, 0.0236]);

                const path = d3.geoPath().projection(projection);

                // Create counties group
                const countiesGroup = svg.append('g')
                    .attr('class', 'counties');

                // Add counties
                updateProgress('Rendering counties', 90);
                countiesGroup.selectAll('path')
                    .data(kenyaCounties.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('fill', '#ffffff')
                    .attr('stroke', '#000')
                    .attr('stroke-width', 0.5)
                    .attr('class', 'county')
                    .style('transition', 'fill 0.2s ease-in-out')
                    .on('mouseenter', (event, d: Feature<any, CountyProperties>) => {
                        const county = d.properties.COUNTY;
                        setHoveredCounty(county);
                        d3.select(event.target)
                            .attr('fill', '#60a5fa')
                            .attr('stroke-width', 1);
                    })
                    .on('mouseleave', (event) => {
                        setHoveredCounty(null);
                        d3.select(event.target)
                            .attr('fill', '#ffffff')
                            .attr('stroke-width', 0.5);
                    });

                // Add zoom behavior
                const zoom = d3.zoom()
                    .scaleExtent([1, 8])
                    .on('zoom', (event) => {
                        countiesGroup.attr('transform', event.transform);
                    });

                svg.call(zoom);

                updateProgress('Complete', 100);
                setLoading(false);

            } catch (error) {
                console.error('Map initialization error:', error);
                updateProgress('Error occurred', 0);
            }
        };

        initMap();

        return () => {
            if (svgRef.current) {
                svgRef.current.remove();
                svgRef.current = null;
            }
        };
    }, [mounted]);

    if (loading) {
        return (
            <div
                ref={containerRef}
                className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-4 border border-gray-200 rounded-lg"
            >
                <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500">{stage}</span>
                </div>

                <div className="w-full max-w-xs space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 text-center">
                        {progress.toFixed(0)}% - {stage}
                    </p>
                </div>

                <Alert>
                    <AlertDescription className="text-xs">
                        Stage: {stage}
                        <br />
                        Progress: {progress.toFixed(0)}%
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-white rounded-lg shadow-sm"
            style={{
                minHeight: '400px',
                minWidth: '300px'
            }}
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