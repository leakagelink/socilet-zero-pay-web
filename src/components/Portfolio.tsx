
import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PortfolioFilters from './portfolio/PortfolioFilters';
import PortfolioGrid from './portfolio/PortfolioGrid';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

// Import the portfolioItems and loadPortfolioItems from our refactored structure
import { portfolioItems, loadPortfolioItems } from './admin/portfolioData';

const ITEMS_PER_PAGE = 6;

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedItems, setDisplayedItems] = useState(portfolioItems);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Make sure we're always showing the latest portfolio items
  useEffect(() => {
    // Force reload items from localStorage to get the latest data
    const items = loadPortfolioItems();
    setDisplayedItems(items);
    
    // Add event listener for storage events to update when localStorage changes
    const handleStorageChange = () => {
      const updatedItems = loadPortfolioItems();
      setDisplayedItems(updatedItems);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
    ? displayedItems 
    : displayedItems.filter(item => item.category === activeFilter);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Helper function to get category label from category id
  const getCategoryLabel = (categoryId: string) => {
    const filter = filters.find(f => f.id === categoryId);
    return filter?.label || categoryId;
  };

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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

        {filteredItems.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </motion.div>
        ) : (
          <>
            <PortfolioGrid 
              items={paginatedItems}
              getCategoryLabel={getCategoryLabel}
            />

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12"
              >
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          isActive={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </>
        )}

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
