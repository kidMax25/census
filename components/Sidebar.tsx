// components/Sidebar.tsx
import React from 'react';
import SidePanel from './Sidepanel';
import CustomCard from './Card';
import { Home, Users, UserCheck, DollarSign, GraduationCap, Zap, BookOpen, NotebookPen, UserRound } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Speedometer from './Speedometer';

interface SidebarProps {
  isLoading?: boolean;
  className?: string;
}

const Sidebar = ({ isLoading = false, className }: SidebarProps) => {
    return (
        <SidePanel className={className}>
          <div className="ml-3 mb-3">
            <h1 className="dashboard-title">Kenya 2019 Census</h1>
            {isLoading ? (
              <Skeleton className="h-8 w-40 mt-2" /> 
            ) : (
              <div className="ml-4 mt-2">
                <span className="dashboard-subtitle">Population</span>
                <p className="stat-value">56.4M</p>
              </div>
            )}
          </div>
      
          {isLoading ? (
            <div className="space-y-2"> 
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-2"> 
              <CustomCard
                title="Number of Households"
                subtitle="300"
                icon={Home}
                className="py-3"
              />
              <CustomCard
                title="GDP/Capita"
                subtitle="$2,110"
                icon={DollarSign}
                className="py-3"
              />
              <CustomCard
                title="Population Density"
                subtitle="94.6 people per km²"
                icon={Users}
                className="py-3"
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
        <div className="mt-6">
  <div className="flex justify-between px-6 mb-4">
    <Speedometer
      value={78.8}
      maxValue={100}
      lineColor="#FB6107"
      label="Litteracy"
      icon = {<UserRound size={15}/>}
    />
    <Speedometer
      value={85}
      maxValue={100}
      lineColor="#2C2916"
      label="Electricity"
      icon = {<Zap size={15}/>}
    />
  </div>
  <div className="flex justify-center">
    <Speedometer
      value={92.4}
      maxValue={100}
      lineColor="#FBB02D"
      label="Education"
      icon = {<NotebookPen size={15}/>}
    />
  </div>
</div>
      )}
        </SidePanel>
      );
};

export default Sidebar;