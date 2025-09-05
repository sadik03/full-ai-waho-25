import React from 'react';
import { motion } from 'framer-motion';

interface ImageContainerProps {
  className?: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative"
      >
        <img 
          src="/men-bag.png" 
          alt="Travel Bag" 
          className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] 
                     h-auto min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[450px] 
                     max-h-[50vh] object-cover object-center 
                     transition-all duration-500 hover:scale-105"
        />
      </motion.div>
    </div>
  );
};

export default ImageContainer;
