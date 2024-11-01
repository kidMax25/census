import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface SpeedometerProps {
  value: number;
  maxValue: number;
  lineColor?: string;
  glowColor?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  animationDuration?: number;
  pulseFrequency?: number;
}

const Speedometer = ({ 
  value, 
  maxValue, 
  lineColor = '',
  glowColor = '',
  className,
  label,
  icon,
  animationDuration = 1500,
  pulseFrequency = 1500
}: SpeedometerProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  const targetPercentage = Math.min((value / maxValue) * 100, 100);
  const strokeWidth = 2;
  const radius = 30;
  const startAngle = 90;
  const endAngle = 330;
  const center = radius + strokeWidth;
  const size = (radius + strokeWidth) * 2;

  // Progress animation
  useEffect(() => {
    setIsAnimating(true);
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * targetPercentage;
      
      setAnimatedValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      setIsAnimating(false);
    };
  }, [targetPercentage, animationDuration]);

  // Glow pulsing animation
  useEffect(() => {
    let startTime = performance.now();
    
    const animateGlow = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      // Create a smooth sine wave for the glow intensity
      const intensity = (Math.sin(elapsed * (2 * Math.PI) / pulseFrequency) + 1) / 2;
      setGlowIntensity(intensity);
      
      requestAnimationFrame(animateGlow);
    };
    
    const animationFrame = requestAnimationFrame(animateGlow);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [pulseFrequency]);

  const calculatePath = (radius: number) => {
    const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}`;
  };

  const progressPath = calculatePath(radius);
  const pathLength = 2 * Math.PI * radius * (240 / 360);
  const progressOffset = pathLength * (1 - (animatedValue / 100));

  // Calculate dynamic filter values based on glow intensity
  const blurRadius = 4 + (glowIntensity * 2);
  const glowOpacity = 0.4 + (glowIntensity * 0.6);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <div className="relative">
        <svg width={size} height={size}>
          {/* Define the glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 20 -10"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <path
            d={progressPath}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          <path
            d={progressPath}
            stroke={glowColor}
            strokeWidth={strokeWidth + 2}
            fill="none"
            strokeDasharray={pathLength}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            style={{
              filter: 'url(#glow)',
              opacity: glowOpacity
            }}
          />
          
          {/* Main progress path */}
          <path
            d={progressPath}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={pathLength}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Centered percentage and icon */}
        <div className="absolute inset-0 flex items-center justify-center space-x-1">
          <span className="text-xl font-bold text-gray-900 tabular-nums font-feature-settings-zero">
            {Math.round(animatedValue)}
          </span>
          {icon && <div>{icon}</div>}
        </div>
        
        {/* Label */}
        <div 
          className="absolute flex justify-center text-xs font-medium text-gray-600"
          style={{
            top: "68%",
            left: "78%",
            transform: "translate(-50%, 0)",
            width: "130%",
            textAlign: "center"
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default Speedometer;