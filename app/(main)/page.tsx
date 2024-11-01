// app/(main)/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isLoading={isLoading} />
      <main className="flex-1 p-6">
        {/* Map and other content will go here */}
        <div className="h-full bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-gray-200" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map Content Will Go Here
            </div>
          )}
        </div>
      </main>
    </div>
  );
}