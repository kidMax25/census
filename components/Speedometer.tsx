// components/Speedometer.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface SpeedometerProps {
  value: number;
  maxValue: number;
  lineColor?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

const Speedometer = ({ 
  value, 
  maxValue, 
  lineColor = '#3b82f6',
  className,
  label,
  icon
}: SpeedometerProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeWidth = Math.max(2, Math.min(percentage / 10, 8));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center justify-center", className)}>
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          className="transition-all duration-300"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={lineColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-gray-500">
          {value.toLocaleString()} / {maxValue.toLocaleString()}
        </span>
      </div>
      {(label || icon) && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {icon}
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        </div>
      )}
    </div>
  );
};

export default Speedometer;