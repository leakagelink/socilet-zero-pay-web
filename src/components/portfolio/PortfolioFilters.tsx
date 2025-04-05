
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface FilterItem {
  id: string;
  label: string;
}

interface PortfolioFiltersProps {
  filters: FilterItem[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ 
  filters, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <motion.div 
      className="flex flex-wrap justify-center mb-12 gap-2"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {filters.map((filter, index) => (
        <motion.div
          key={filter.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.4 }}
        >
          <Button
            onClick={() => onFilterChange(filter.id)}
            variant={activeFilter === filter.id ? "default" : "outline"}
            className={`px-5 py-2 rounded-full transition-all ${
              activeFilter === filter.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            size="sm"
          >
            {filter.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PortfolioFilters;
