// app/(main)/page.tsx
"use client";

import D3Map from "@/components/map/d3-map";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

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
      {/* Sidebar Container with fixed positioning */}
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar isLoading={isLoading} className="bg-customGray border-none" />
      </div>

      {/* Main content with margin to account for sidebar */}
      <main className="flex-1 ml-[300px] p-6">
        {" "}
        {/* Adjust ml-[300px] based on your sidebar width */}
        <div className="h-[calc(100vh-48px)] bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-customGray" />
          ) : (
            <div className="w-full h-full relative p-4">
              <D3Map />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
