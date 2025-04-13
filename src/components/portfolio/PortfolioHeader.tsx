
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PortfolioHeaderProps {
  onForceRefresh?: () => void;
  isDevelopment?: boolean;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ 
  onForceRefresh,
  isDevelopment = false
}) => {
  return (
    <motion.div 
      className="text-center max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl font-bold mb-2">Our Portfolio</h2>
      <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
      <p className="text-gray-600">
        Explore our successful projects delivered with our unique zero advance payment model.
        We've completed over 900 projects across various industries.
      </p>
      
      {/* Hidden developer button for force refresh - only in development */}
      {isDevelopment && onForceRefresh && (
        <button 
          onClick={onForceRefresh}
          className="mt-2 text-xs text-gray-400 hover:text-primary-600"
        >
          (Reset Portfolio)
        </button>
      )}
    </motion.div>
  );
};

export default PortfolioHeader;
