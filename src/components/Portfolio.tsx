
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PortfolioFilters from './portfolio/PortfolioFilters';
import PortfolioGrid from './portfolio/PortfolioGrid';
import PortfolioHeader from './portfolio/PortfolioHeader';
import PortfolioPagination from './portfolio/PortfolioPagination';
import ViewAllProjectsButton from './portfolio/ViewAllProjectsButton';
import EmptyPortfolioState from './portfolio/EmptyPortfolioState';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import PortfolioTabs from './portfolio/PortfolioTabs';

const ITEMS_PER_PAGE = 6;

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { filteredItems, handleForceRefresh } = usePortfolioItems(activeFilter);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'websites', label: 'Websites' },
    { id: 'apps', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Spokespersons' },
    { id: 'business', label: 'Business Listings' },
  ];

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

  // Handler for force refresh
  const handleForcedRefresh = () => {
    handleForceRefresh();
    toast.success('Portfolio reset to defaults and refreshed');
  };

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <PortfolioHeader 
          onForceRefresh={handleForcedRefresh}
          isDevelopment={process.env.NODE_ENV === 'development'}
        />

        {filteredItems.length === 0 ? (
          <EmptyPortfolioState />
        ) : (
          <>
            {/* Use the new tabs component instead of filters */}
            <PortfolioTabs 
              items={paginatedItems}
              getCategoryLabel={getCategoryLabel}
            />

            <PortfolioPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        <ViewAllProjectsButton />
      </div>
    </section>
  );
};

export default Portfolio;
