
import React from 'react';
import { motion } from "framer-motion";

const EmptyPortfolioState: React.FC = () => {
  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-gray-500 text-lg">No projects found in this category.</p>
    </motion.div>
  );
};

export default EmptyPortfolioState;
