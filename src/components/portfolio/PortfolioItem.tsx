
import React from 'react';
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export interface PortfolioItemProps {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  url?: string;
  categoryLabel: string;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  title,
  category,
  image,
  description,
  url,
  categoryLabel
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500"
      whileHover={{ y: -10 }}
    >
      <div className="overflow-hidden h-48 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
          <span className="text-white font-medium text-sm bg-primary-600 px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {url ? (
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium group/link"
          >
            <span>Visit Website</span> 
            <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </a>
        ) : (
          <a 
            href="#" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium group/link"
          >
            <span>View Project</span> 
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default PortfolioItem;
