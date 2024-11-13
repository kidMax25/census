import Speedometer from "@/components/Speedometer";
import { Button } from "@/components/ui/button";
import { GeminiCountyInfo } from "@/services/gemini";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { Feature } from "geojson";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface CountyDetailProps {
  county: Feature;
  onBack: () => void;
  countyInfo: GeminiCountyInfo | null;
  isLoading: boolean;
}

const CountyDetail: React.FC<CountyDetailProps> = ({
  county,
  onBack,
  countyInfo,
  isLoading,
}) => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !county.geometry) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    mapRef.current = svg.node();

    const projection = d3
      .geoMercator()
      .fitSize([width - 40, height - 40], county)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countyPath = svg
      .append("path")
      .datum(county)
      .attr("d", path)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [county]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full bg-white"
    >
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kenya</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 h-full">
        {/* Map Container */}
        <div ref={containerRef} className="col-span-2 relative" />

        {/* Info Panel */}
        <div className="p-6 border-l">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : countyInfo ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {county.properties.COUNTY_NAM}
                </h2>
                <p className="text-gray-600 mt-2">
                  {countyInfo.description.overview}
                </p>
              </div>

              {/* Speedometers */}
              <div className="grid grid-cols-2 gap-4">
                <Speedometer
                  value={countyInfo.statistics.gdpContribution}
                  maxValue={100}
                  label="GDP Contribution"
                />
                {/* Add more speedometers as needed */}
              </div>

              {/* Additional Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold">Main Income Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {countyInfo.description.mainIncomeSources.map((source, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {source}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold">Tribes</h3>
                <div className="flex flex-wrap gap-2">
                  {countyInfo.description.tribes.map((tribe, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tribe}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold">Leadership</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {countyInfo.statistics.leader.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {countyInfo.statistics.leader.position}
                  </p>
                  <p className="text-sm text-gray-500">
                    {countyInfo.statistics.leader.period}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No information available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CountyDetail;
