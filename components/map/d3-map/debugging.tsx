// components/map/d3-map/debug.tsx
import React from 'react';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface MapDebugState {
  loading: boolean;
  currentView: 'kenya' | 'county' | null;
  currentCounty: string | null;
  filePath: string | null;
  progress: number;
  stage: string;
  error: string | null;
}

interface DebugProps {
  state: MapDebugState;
}

const MapDebug: React.FC<DebugProps> = ({ state }) => {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg space-y-4 z-50">
      {/* Loading State */}
      {state.loading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-500">
            {state.stage} ({state.progress}%)
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={state.progress} className="h-2" />
        <p className="text-xs text-gray-500">
          View: {state.currentView || 'none'} 
          {state.currentCounty && ` - County: ${state.currentCounty}`}
        </p>
      </div>

      {/* File Path */}
      {state.filePath && (
        <div className="text-xs text-gray-600 font-mono break-all">
          Path: {state.filePath}
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-xs">
            {state.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MapDebug;