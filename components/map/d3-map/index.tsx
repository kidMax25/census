// components/map/d3-map/index.tsx
import { AnimatePresence, motion } from "framer-motion";
import { Feature } from "geojson";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MapDebug, { MapDebugState } from "./debugging";
import { mapRenderer } from "./renderer";

interface D3MapProps {
  selectedCounty: Feature | null;
  hoveredCounty: Feature | null;
  onHover: (county: Feature | null) => void;
  onSelect: (county: Feature) => void;
  isTransitioning: boolean;
  showDetailView: boolean;
}

const D3Map: React.FC<D3MapProps> = ({
  selectedCounty,
  hoveredCounty,
  onHover,
  onSelect,
  isTransitioning,
  showDetailView,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugState, setDebugState] = useState<MapDebugState>({
    loading: true,
    currentView: null,
    currentCounty: null,
    filePath: null,
    progress: 0,
    stage: "Starting",
    error: null,
  });

  const updateDebugState = (update: Partial<MapDebugState>) => {
    setDebugState((prev) => ({ ...prev, ...update }));
  };

  const handleHover = (
    county: Feature | null,
    selection: d3.Selection<any, any, any, any>
  ) => {
    if (county) {
      selection
        .transition()
        .duration(200)
        .attr("stroke-width", 2)
        .attr("stroke", "#FB8D3D")
        .attr("fill", "#FB8D3D")
        .style("opacity", 0.7);

      onHover(county);
    } else {
      selection
        .transition()
        .duration(200)
        .attr("stroke-width", 0.5)
        .attr("stroke", "#000")
        .attr("fill", "#ffffff")
        .style("opacity", 1);

      onHover(null);
    }
  };

  const renderMap = async (type: "kenya" | "county", countyName?: string) => {
    if (!containerRef.current) return;

    await mapRenderer.renderMap({
      container: containerRef.current,
      mapType: type,
      countyName,
      onDebugUpdate: updateDebugState,
      enhancedOptions: {
        onCountyHover: handleHover,
        onCountyClick: onSelect,
      },
    });
  };

  // Initial render
  useEffect(() => {
    renderMap("kenya");
  }, []);

  // Handle county selection
  useEffect(() => {
    if (selectedCounty && !isTransitioning) {
      renderMap("county", selectedCounty.properties.COUNTY_NAM);
    }
  }, [selectedCounty, isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white rounded-lg shadow-sm"
      style={{ minHeight: "600px" }}
    >
      <MapDebug state={debugState} />

      <AnimatePresence>
        {selectedCounty && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
            onClick={() => renderMap("kenya")}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kenya</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default D3Map;
