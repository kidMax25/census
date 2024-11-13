"use client";

import { useEffect, useState } from "react";
import MapController from "@/components/map/MapController";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-customGray">
      <MapController 
        isInitialLoading={isLoading}
        className="flex-1"
        sidebarWidth={300}
      />
    </div>
  );
}