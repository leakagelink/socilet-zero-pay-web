import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem, defaultPortfolioItems } from '@/types/portfolio';

export const usePortfolioItems = (activeFilter: string) => {
  const [displayedItems, setDisplayedItems] = useState<PortfolioItem[]>(defaultPortfolioItems);
  
  const sortItemsByPriority = (items: PortfolioItem[]): PortfolioItem[] => {
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
      if (a.title === 'Bharat Startup Solution') return -1;
      if (b.title === 'Bharat Startup Solution') return 1;
      
      if (a.isReactProject && !b.isReactProject) return -1;
      if (!a.isReactProject && b.isReactProject) return 1;
      
      if (a.isWordPressProject && !b.isWordPressProject) return -1;
      if (!a.isWordPressProject && b.isWordPressProject) return 1;
      
      return 0;
    });
    
    return sortedItems;
  };

  const refreshPortfolioItems = useCallback(() => {
    const sortedItems = sortItemsByPriority(defaultPortfolioItems);
    setDisplayedItems(sortedItems);
    return sortedItems;
  }, []);
  
  const handleForceRefresh = useCallback(() => {
    const sortedItems = sortItemsByPriority(defaultPortfolioItems);
    setDisplayedItems(sortedItems);
    return sortedItems;
  }, []);
  
  useEffect(() => {
    refreshPortfolioItems();
  }, [refreshPortfolioItems]);

  useEffect(() => {
    refreshPortfolioItems();
  }, [activeFilter, refreshPortfolioItems]);

  const filteredItems = activeFilter === 'all' 
    ? displayedItems 
    : displayedItems.filter(item => item.category === activeFilter);

  return {
    displayedItems,
    filteredItems,
    refreshPortfolioItems,
    handleForceRefresh
  };
};
