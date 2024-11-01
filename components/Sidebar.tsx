// components/Sidebar.tsx
import React from 'react';
import { SidePanel } from './index';
import { CustomCard } from './index';
import { Speedometer } from './index';
import { Home, Users, UserCheck, DollarSign, GraduationCap, Zap, BookOpen } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface SidebarProps {
  isLoading?: boolean;
}

const Sidebar = ({ isLoading = false }: SidebarProps) => {
  return (
    <SidePanel>
      {/* Title */}
      <div className="ml-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kenya 2019 Census</h1>
        {isLoading ? (
          <Skeleton className="h-8 w-40 mt-4" />
        ) : (
          <div className="ml-4 mt-4">
            <span className="text-gray-600 text-sm">Population</span>
            <p className="text-2xl font-semibold text-gray-900">59,000,000,000</p>
          </div>
        )}
      </div>

      {/* Cards Section */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <CustomCard
            title="Number of Households"
            subtitle="300"
            icon={Home}
          />
          <CustomCard
            title="Male - Female Ratio"
            subtitle="50.9%"
            icon={UserCheck}
          />
          <CustomCard
            title="GDP/Capita"
            subtitle="$2,110"
            icon={DollarSign}
          />
          <CustomCard
            title="Population Density"
            subtitle="94.6 people per km²"
            icon={Users}
          />
        </div>
      )}

      {/* Speedometers Section */}
      {isLoading ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <Speedometer
            value={78.8}
            maxValue={100}
            lineColor="#3b82f6"
            label="Literacy Rate"
            icon={<BookOpen className="w-4 h-4" />}
          />
          <Speedometer
            value={85}
            maxValue={100}
            lineColor="#10b981"
            label="Electricity Coverage"
            icon={<Zap className="w-4 h-4" />}
          />
          <Speedometer
            value={92.4}
            maxValue={100}
            lineColor="#8b5cf6"
            label="Primary Education Access"
            icon={<GraduationCap className="w-4 h-4" />}
          />
        </div>
      )}
    </SidePanel>
  );
};

export default Sidebar;