
import React, { useState, useEffect } from 'react';
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PortfolioFilters from './portfolio/PortfolioFilters';
import PortfolioGrid from './portfolio/PortfolioGrid';

// Import the loadPortfolioItems function to get the current portfolio data
import { loadPortfolioItems } from './admin/portfolioData';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  
  // Load portfolio items when component mounts
  useEffect(() => {
    setPortfolioItems(loadPortfolioItems());
  }, []);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'websites', label: 'Websites' },
    { id: 'apps', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Spokespersons' },
    { id: 'business', label: 'Business Listings' },
  ];

  // Filter portfolio items based on the active filter
  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  // Helper function to get category label from category id
  const getCategoryLabel = (categoryId: string) => {
    const filter = filters.find(f => f.id === categoryId);
    return filter?.label || categoryId;
  };

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
        </motion.div>

        <PortfolioFilters 
          filters={filters} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        <PortfolioGrid 
          items={filteredItems}
          getCategoryLabel={getCategoryLabel}
        />

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            className="bg-primary-600 hover:bg-primary-700 group"
            size="lg"
          >
            <span>View All Projects</span>
            <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
