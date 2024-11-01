// components/Card.tsx
import React from 'react';
import { Card as ShadCard, CardContent } from './ui/card';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

const CustomCard = ({ 
  title, 
  subtitle, 
  icon: Icon,
  className 
}: CardProps) => {
  return (
    <ShadCard className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
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

export default CustomCard;