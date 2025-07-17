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
    
    // Check specifically for the personalized gift project
    const personalizedGiftProject = items.find(item => 
      item.title === 'भारत का No.1 Personalized Gift Platform'
    );
    
    if (personalizedGiftProject) {
      console.log('✅ Personalized Gift Platform project found in portfolio items');
    } else {
      console.warn('❌ Personalized Gift Platform project NOT found - forcing reset');
      // Force reset if the project is missing
      const resetItems = resetToDefaults();
      const sortedItems = sortItemsByPriority(resetItems);
      setDisplayedItems(sortedItems);
      return resetItems;
    }
    
    // Sort items according to priority
    const sortedItems = sortItemsByPriority(items);
    setDisplayedItems(sortedItems);
    return sortedItems;
  }, []);
  
  // Force refresh button for debugging
  const handleForceRefresh = useCallback(() => {
    console.log('Force refresh triggered - clearing cache and reloading');
    localStorage.removeItem('portfolioItems'); // Clear cached data
    const resetItems = resetToDefaults();
    const sortedItems = sortItemsByPriority(resetItems);
    setDisplayedItems(sortedItems);
    return resetItems;
  }, []);
  
  // Make sure we're always showing the latest portfolio items
  useEffect(() => {
    // Initial load with forced refresh
    console.log('usePortfolioItems: Initial load starting');
    const items = refreshPortfolioItems();
    
    // Debug: Log all project titles to verify the personalized gift project
    console.log('All portfolio project titles:', items.map(item => item.title));
    
    // Add event listener for storage events to update when localStorage changes
    const handleStorageChange = () => {
      console.log('Storage event detected - refreshing portfolio');
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
