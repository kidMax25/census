import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Feature } from 'geojson';

interface TransitionContainerProps {
  isTransitioning: boolean;
  selectedCounty: Feature | null;
  children: React.ReactNode;
  onTransitionComplete: () => void;
}

const TransitionContainer: React.FC<TransitionContainerProps> = ({
  isTransitioning,
  selectedCounty,
  children,
  onTransitionComplete
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isTransitioning) {
      setScale(1.5);
    } else {
      setScale(1);
    }
  }, [isTransitioning]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCounty ? selectedCounty.properties.COUNTY_NAM : 'kenya'}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ 
          opacity: 1, 
          scale,
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
        exit={{ 
          opacity: 0,
          scale: selectedCounty ? 0.5 : 1.5,
          transition: {
            duration: 0.5
          }
        }}
        onAnimationComplete={() => {
          if (isTransitioning) {
            onTransitionComplete();
          }
        }}
        className="w-full h-full relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionContainer;