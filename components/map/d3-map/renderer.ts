// components/map/d3-map/mapRenderer.ts
import * as d3 from "d3";
import { Feature, FeatureCollection } from "geojson";
import { MapDebugState } from "./debugging";

interface RenderMapOptions {
  container: HTMLDivElement;
  mapType: "kenya" | "county";
  countyName?: string;
  onDebugUpdate: (state: Partial<MapDebugState>) => void;
  enhancedOptions: EnhancedOptions;
}

const sanitizeCountyName = (name: string): string => {
  // Convert to lowercase and handle special characters
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

export const mapRenderer = {
  async loadCountyData(
    countyName: string,
    onDebugUpdate: (state: Partial<MapDebugState>) => void
  ) {
    const sanitizedName = sanitizeCountyName(countyName);
    // Correct path based on your project structure
    const path = `/counties/geojson/${sanitizedName}.json`;

    console.log("Attempting to load county from:", path);
    onDebugUpdate({
      stage: "Loading county data",
      filePath: path,
    });

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`County file not found: ${countyName}`);
      }
      const data = await response.json();
      console.log(`Successfully loaded data for ${countyName}`);
      return data;
    } catch (error) {
      console.error(`Failed to load county data: ${countyName}`);
      // Try alternative path as fallback
      const altPath = `/geojson/${sanitizedName}.json`;
      console.log("Trying alternative path:", altPath);

      const altResponse = await fetch(altPath);
      if (!altResponse.ok) {
        throw new Error(`Failed to load county data: ${countyName}`);
      }
      return await altResponse.json();
    }
  },

  async renderMap({
    container,
    mapType,
    countyName,
    onDebugUpdate,
    enhancedOptions,
  }: RenderMapOptions) {
    console.log(
      `MapRenderer: Starting render - ${mapType} ${countyName || ""}`
    );

    try {
      const { width, height } = container.getBoundingClientRect();

      // Clear existing SVG
      d3.select(container).selectAll("svg").remove();

      onDebugUpdate({
        loading: true,
        currentView: mapType,
        currentCounty: countyName || null,
        progress: 10,
        stage: "Initializing",
      });

      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

      if (mapType === "kenya") {
        onDebugUpdate({ progress: 30, stage: "Loading Kenya map" });
        const response = await fetch("/Geojson/kenya.geojson");
        if (!response.ok) {
          throw new Error("Failed to load Kenya map");
        }
        const kenyaData: FeatureCollection = await response.json();

        const projection = d3
          .geoMercator()
          .fitSize([width - 40, height - 40], kenyaData)
          .center([37.9062, 0.0236])
          .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        onDebugUpdate({ progress: 60, stage: "Rendering Kenya map" });

        // Render counties
        const counties = svg
          .append("g")
          .selectAll("path")
          .data(kenyaData.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "#ffffff")
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5)
          .attr("class", "county");

        // Add interactions
        counties
          .on("click", async (event, d: Feature) => {
            event.stopPropagation();
            console.log("County clicked:", d.properties.COUNTY_NAM);
            enhancedOptions.onCountyClick(d);
          })
          .on("mouseenter", function (event, d: Feature) {
            enhancedOptions.onCountyHover(d, d3.select(this));
          })
          .on("mouseleave", function (event, d: Feature) {
            enhancedOptions.onCountyHover(null, d3.select(this));
          });
      } else if (mapType === "county" && countyName) {
        onDebugUpdate({ progress: 30, stage: "Loading county data" });
        const countyData = await this.loadCountyData(countyName, onDebugUpdate);

        onDebugUpdate({ progress: 60, stage: "Rendering county map" });

        const projection = d3
          .geoMercator()
          .fitSize([width - 40, height - 40], countyData)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Render county with enhanced styling
        svg
          .append("path")
          .datum(countyData)
          .attr("d", path)
          .attr("fill", "#e2e8f0")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))");
      }

      onDebugUpdate({
        loading: false,
        progress: 100,
        stage: "Complete",
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error("MapRenderer: Error -", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      onDebugUpdate({
        loading: false,
        progress: 0,
        stage: "Error",
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },
};
