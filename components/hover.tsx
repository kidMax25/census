import React from 'react';
import { Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CountyHoverEffectProps {
  progress: number; // 0-100
  isActive: boolean;
  position: { x: number; y: number };
}

const CountyHoverEffect: React.FC<CountyHoverEffectProps> = ({
  progress,
  isActive,
  position
}) => {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Circular progress indicator */}
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-gray-200"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-blue-500"
          strokeWidth="2"
          strokeDasharray={`${progress * 1.005}, 100`}
          transform="rotate(-90 18 18)"
        />
      </svg>
      
      {/* Ripple effect */}
      <div className={cn(
        "absolute inset-0 transition-transform duration-1000",
        isActive && progress > 50 ? "scale-150 opacity-0" : "scale-100 opacity-100"
      )}>
        <Circle className="w-full h-full text-blue-500/20" />
      </div>
    </div>
  );
};

export default CountyHoverEffect;