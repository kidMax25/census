// components/SidePanel.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface SidePanelProps {
  children: React.ReactNode;
  className?: string;
}

const SidePanel = ({ children, className }: SidePanelProps) => {
    return (
        <div 
          className={cn(
            "w-80 h-full bg-customGray backdrop-blur-sm p-4",
            "shadow-lg",
            "flex flex-col gap-3",
            className
          )}
        >
          <div className="flex-1">
            {children}
          </div>
        </div>
      );
};

export default SidePanel;