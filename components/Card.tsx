// components/ui/card.tsx
import React from 'react';
import { Card as ShadCard, CardContent } from './ui/card';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  icon: Icon,
  className 
}) => {
  return (
    <ShadCard className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold leading-none tracking-tight truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </ShadCard>
  );
};

export default Card;