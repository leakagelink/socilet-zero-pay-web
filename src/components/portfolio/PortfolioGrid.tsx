
import React from 'react';
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

  return (
    <motion.div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {items.map((portfolioItem) => (
        <motion.div key={portfolioItem.id} variants={item}>
          <PortfolioItem 
            {...portfolioItem} 
            categoryLabel={getCategoryLabel(portfolioItem.category)} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PortfolioGrid;
