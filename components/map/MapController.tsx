import CountyDetail from "@/components/county-detail";
import CountyInfoCards from "@/components/InfoCards";
import Sidebar from "@/components/Sidebar";
import { GeminiCountyInfo, getCountyInfo } from "@/services/gemini";
import { useDebounce } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Feature } from "geojson";
import React, { useCallback, useEffect, useState } from "react";
import D3Map from "./d3-map";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(
  countyName: string,
  retries = MAX_RETRIES
): Promise<GeminiCountyInfo> {
  try {
    return await getCountyInfo(countyName);
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(countyName, retries - 1);
    }
    throw error;
  }
}

interface MapControllerProps {
  isInitialLoading: boolean;
  className?: string;
  sidebarWidth?: number;
}

const MapController: React.FC<MapControllerProps> = ({
  isInitialLoading,
  className,
  sidebarWidth = 300,
}) => {
  const [hoveredCounty, setHoveredCounty] = useState<Feature | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countyInfo, setCountyInfo] = useState<any>(null);
  const [showCards, setShowCards] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  // Debounce hover to prevent rapid fire API calls
  const debouncedHoveredCounty = useDebounce(hoveredCounty, 2000);

  const handleCountyInfo = (countyInfo: any) => {
    // Handle county selection
    setShowDetailView(true);
  };

  const handleBackToOverview = () => {
    setShowDetailView(false);
  };

  // Handle hover effects and data loading
  useEffect(() => {
    if (debouncedHoveredCounty && !selectedCounty) {
      const loadCountyInfo = async () => {
        setIsLoading(true);
        try {
          const info = await fetchWithRetry(
            debouncedHoveredCounty.properties.COUNTY_NAM
          );
          setCountyInfo(info);
          setShowCards(true);
        } catch (error) {
          console.error("Error loading county info:", error);
          setShowCards(false);
        } finally {
          setIsLoading(false);
        }
      };

      loadCountyInfo();
    } else {
      setShowCards(false);
    }
  }, [debouncedHoveredCounty, selectedCounty]);

  // Handle county selection
  const handleCountySelect = useCallback(async (county: Feature) => {
    setIsTransitioning(true);
    setSelectedCounty(county);

    try {
      const info = await fetchWithRetry(county.properties.COUNTY_NAM);
      setCountyInfo(info);
    } catch (error) {
      console.error("Error loading county info:", error);
      // Show error state or fallback UI
    } finally {
      setIsTransitioning(false);
    }
  }, []);

  // Handle back to overview
  const handleBack = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCounty(null);
      setCountyInfo(null);
      setIsTransitioning(false);
    }, 500);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={
            selectedCounty
              ? `sidebar-${selectedCounty.properties.COUNTY_NAM}`
              : "sidebar-main"
          }
          initial={{ x: -sidebarWidth }}
          animate={{ x: 0 }}
          exit={{ x: -sidebarWidth }}
          transition={{ duration: 0.5 }}
          className="fixed left-0 top-0 h-full z-50"
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            isLoading={isInitialLoading || isTransitioning}
            className="bg-customGray border-none"
            customData={
              selectedCounty
                ? {
                    title: selectedCounty.properties.COUNTY_NAM,
                    population:
                      countyInfo?.statistics?.population || "Loading...",
                    stats: countyInfo?.statistics || {},
                    metrics: {
                      literacy: countyInfo?.statistics?.literacyRate || 0,
                      electricity:
                        countyInfo?.statistics?.electricityAccess || 0,
                      education: countyInfo?.statistics?.educationAccess || 0,
                    },
                  }
                : undefined
            }
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        className={className}
        style={{ marginLeft: `${sidebarWidth}px` }}
        initial={false}
        animate={{
          scale: isTransitioning ? 0.95 : 1,
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              selectedCounty
                ? `detail-${selectedCounty.properties.COUNTY_NAM}`
                : "overview"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-[calc(100vh-3rem)] relative rounded-lg overflow-hidden"
          >
            {isInitialLoading ? (
              <div className="w-full h-full animate-pulse bg-customGray" />
            ) : (
              <>
                <D3Map
                  selectedCounty={selectedCounty}
                  hoveredCounty={hoveredCounty}
                  onHover={setHoveredCounty}
                  onSelect={handleCountySelect}
                  isTransitioning={isTransitioning}
                  onCountyInfo={handleCountyInfo}
                  onBackToOverview={handleBackToOverview}
                  showDetailView={showDetailView}
                />

                {/* Info Cards */}
                <CountyInfoCards
                  isLoading={isLoading}
                  showCards={showCards}
                  description={countyInfo?.description}
                  statistics={countyInfo?.statistics}
                />

                {/* County Detail View */}
                {selectedCounty && (
                  <CountyDetail
                    county={selectedCounty}
                    countyInfo={countyInfo}
                    isLoading={isLoading}
                    onBack={handleBack}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default MapController;
