
import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import PortfolioItem, { PortfolioItemProps } from './PortfolioItem';

interface PortfolioGridProps {
  items: Omit<PortfolioItemProps, 'categoryLabel'>[];
  getCategoryLabel: (category: string) => string;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, getCategoryLabel }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Log the number of items being rendered for debugging
  console.log(`Rendering ${items.length} portfolio items in grid`);
  
  // Log detailed info about each portfolio item to debug missing projects
  useEffect(() => {
    const projectUrls = ['docucreatorpro.online', 'desiaicontent.online', 'pluginpal.xyz'];
    
    // Check if our specific projects exist in the provided items
    projectUrls.forEach(url => {
      const found = items.some(item => item.url && item.url.includes(url));
      console.log(`Project ${url} found in grid items: ${found}`);
    });
    
    // Log all project URLs for verification
    console.log('All URLs in grid items:', items.map(item => item.url || 'no-url'));
  }, [items]);
  
  return (
    <motion.div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
      layout
    >
      {items.length ? (
        items.map((portfolioItem) => (
          <motion.div 
            key={portfolioItem.id} 
            variants={item}
            layout
            className="h-full flex"
          >
            <PortfolioItem 
              {...portfolioItem} 
              categoryLabel={getCategoryLabel(portfolioItem.category)} 
            />
          </motion.div>
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-500">No portfolio items to display.</p>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioGrid;
