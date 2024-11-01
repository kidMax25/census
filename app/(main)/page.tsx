// app/(main)/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Speedometer from '@/components/Speedometer';
import { BookOpen, GraduationCap, Zap } from 'lucide-react';
import Map3D from '@/components/Map3D';
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
    <div className="flex min-h-screen bg-customGray">
      <div>
        <Sidebar isLoading={isLoading} className='bg-customGray border-none'/>
        <div className="">
        
      </div>
    </div>
      <main className="flex-1 p-6">
        {/* Map and other content will go here */}
        <div className="h-full bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-customGray" />
          ) : (
            <div className="w-full h-full flex items-center bg-customGray justify-center text-gray-500">
              <Map3D/>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}