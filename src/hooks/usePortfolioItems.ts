import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem } from '@/components/admin/portfolio/types';
import { loadPortfolioItems, resetToDefaults } from '@/components/admin/portfolioData';

export const usePortfolioItems = (activeFilter: string) => {
  const [displayedItems, setDisplayedItems] = useState<PortfolioItem[]>([]);
  
  // Sort items with React projects first, and ensure Bharat Startup is at the top
  const sortItemsByPriority = (items: PortfolioItem[]): PortfolioItem[] => {
    // First make a copy to avoid mutating the original array
    const sortedItems = [...items];
    
    // Sort by priority: Bharat Startup first, then React projects, then WordPress, then others
    sortedItems.sort((a, b) => {
      // Bharat Startup Solution should always be first
      if (a.title === 'Bharat Startup Solution') return -1;
      if (b.title === 'Bharat Startup Solution') return 1;
      
      // Then React projects
      if (a.isReactProject && !b.isReactProject) return -1;
      if (!a.isReactProject && b.isReactProject) return 1;
      
      // Then WordPress projects
      if (a.isWordPressProject && !b.isWordPressProject) return -1;
      if (!a.isWordPressProject && b.isWordPressProject) return 1;
      
      // Otherwise maintain original order
      return 0;
    });
    
    return sortedItems;
  };

  // Load portfolio items function that can be called multiple times
  const refreshPortfolioItems = useCallback(() => {
    const items = loadPortfolioItems();
    console.log(`Portfolio refreshed with ${items.length} items`);
    
    // Sort items according to priority
    const sortedItems = sortItemsByPriority(items);
    setDisplayedItems(sortedItems);
    return sortedItems;
  }, []);
  
  // Force refresh button for debugging
  const handleForceRefresh = useCallback(() => {
    const resetItems = resetToDefaults();
    const sortedItems = sortItemsByPriority(resetItems);
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
      'solarsavingscalculator.site',
      'lakshmikagriculture.com',
      'inning.live',
      'sossplacementsprivatelimited.com'
    ];
    
    const missingProjects = projectUrls.filter(url => 
      !items.some(item => item.url && item.url.includes(url))
    );
    
    if (missingProjects.length > 0) {
      console.warn(`Missing projects in portfolio: ${missingProjects.join(', ')}`);
      // If specific projects are missing, try reset to defaults as a fallback
      const resetItems = resetToDefaults();
      const sortedResetItems = sortItemsByPriority(resetItems);
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
