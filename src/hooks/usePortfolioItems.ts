import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem } from '@/components/admin/portfolio/types';
import { loadPortfolioItems, resetToDefaults } from '@/components/admin/portfolioData';

export const usePortfolioItems = (activeFilter: string) => {
  const [displayedItems, setDisplayedItems] = useState<PortfolioItem[]>([]);
  
  // Sort items with React projects first
  const sortItemsByReactFirst = (items: PortfolioItem[]): PortfolioItem[] => {
    return [...items].sort((a, b) => {
      // If both or neither are React projects, keep original order
      if ((a.isReactProject && b.isReactProject) || (!a.isReactProject && !b.isReactProject)) {
        return 0;
      }
      // If a is a React project and b is not, a comes first
      if (a.isReactProject && !b.isReactProject) {
        return -1;
      }
      // If b is a React project and a is not, b comes first
      return 1;
    });
  };

  // Load portfolio items function that can be called multiple times
  const refreshPortfolioItems = useCallback(() => {
    const items = loadPortfolioItems();
    console.log(`Portfolio refreshed with ${items.length} items`);
    
    // Sort items to show React projects first
    const sortedItems = sortItemsByReactFirst(items);
    setDisplayedItems(sortedItems);
    return sortedItems;
  }, []);
  
  // Force refresh button for debugging
  const handleForceRefresh = useCallback(() => {
    const resetItems = resetToDefaults();
    const sortedItems = sortItemsByReactFirst(resetItems);
    setDisplayedItems(sortedItems);
    return resetItems;
  }, []);
  
  // Make sure we're always showing the latest portfolio items
  useEffect(() => {
    // Initial load
    const items = refreshPortfolioItems();
    
    // Debug: Check if our specific projects exist
    const projectUrls = [
      'docucreatorpro.online', 
      'desiaicontent.online', 
      'pluginpal.xyz', 
      'solarsavingscalculator.site'
    ];
    
    const missingProjects = projectUrls.filter(url => 
      !items.some(item => item.url && item.url.includes(url))
    );
    
    if (missingProjects.length > 0) {
      console.warn(`Missing projects in portfolio: ${missingProjects.join(', ')}`);
      // If specific projects are missing, try reset to defaults as a fallback
      const resetItems = resetToDefaults();
      const sortedResetItems = sortItemsByReactFirst(resetItems);
      setDisplayedItems(sortedResetItems);
    }
    
    // Add event listener for storage events to update when localStorage changes
    const handleStorageChange = () => {
      refreshPortfolioItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshPortfolioItems]);

  // Refresh on filter change to ensure we get latest items
  useEffect(() => {
    refreshPortfolioItems();
  }, [activeFilter, refreshPortfolioItems]);

  // Filter portfolio items based on the active filter
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
