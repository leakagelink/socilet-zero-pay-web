
import React from 'react';
import { ArrowRight, ExternalLink, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export interface PortfolioItemProps {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  url?: string;
  categoryLabel: string;
  isReactProject?: boolean;
  isWordPressProject?: boolean;
  isUnderDevelopment?: boolean;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  title,
  category,
  image,
  description,
  url,
  categoryLabel,
  isReactProject,
  isWordPressProject,
  isUnderDevelopment
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500 w-full"
      whileHover={{ y: -10 }}
      layout
    >
      <div className="overflow-hidden h-52 relative">
        <img 
          src={image} 
          alt={`${title} - ${categoryLabel} project by Socilet`}
          title={`${title} - Zero Advance Payment ${categoryLabel}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
          onError={(e) => {
            // Fallback image if the original fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = 'https://images.unsplash.com/photo-1551867633-194f125bcc72?auto=format&fit=crop&w=600&h=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
          <span className="text-white font-medium text-sm bg-primary-600 px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
        </div>
        
        {isUnderDevelopment && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-md animate-pulse">
              🚧 Under Development
            </span>
          </div>
        )}

        {isReactProject && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 shadow-md">
              <Code2 className="w-3 h-3 mr-1" />
              React
            </span>
          </div>
        )}

        {isWordPressProject && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-md">
              WordPress
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
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
