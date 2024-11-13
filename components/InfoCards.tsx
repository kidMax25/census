import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { GeminiCountyInfo } from '@/services/gemini';

interface CountyInfoCardsProps {
  isLoading: boolean;
  showCards: boolean;
  description?: GeminiCountyInfo['description'];
  statistics?: GeminiCountyInfo['statistics'];
}

const CountyInfoCards: React.FC<CountyInfoCardsProps> = ({
  isLoading,
  showCards,
  description,
  statistics
}) => {
  return (
    <>
      {/* Top Right Card - County Description */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: showCards ? 1 : 0,
          x: showCards ? 0 : 100
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading county information...</span>
          </div>
        ) : description ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-sm text-gray-600 mt-1">{description.overview}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Main Income Sources</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {description.mainIncomeSources.map((source, i) => (
                  <span key={i} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm">Tribes</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {description.tribes.map((tribe, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {tribe}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Bottom Right Card - Statistics */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: showCards ? 1 : 0,
          x: showCards ? 0 : 100
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute bottom-4 right-4 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading statistics...</span>
          </div>
        ) : statistics ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Leadership</h4>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{statistics.leader.name}</p>
                <p className="text-sm text-gray-600">{statistics.leader.position}</p>
                <p className="text-xs text-gray-500">{statistics.leader.period}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm">Constituencies</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {statistics.constituencies.map((constituency, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {constituency}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm">GDP Contribution</h4>
              <p className="text-2xl font-semibold mt-1">{statistics.gdpContribution}%</p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </>
  );
};

export default CountyInfoCards;