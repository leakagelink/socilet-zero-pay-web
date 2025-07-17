
import { PortfolioItem } from './types';
import { defaultPortfolioItems } from './portfolioItems';

// Track if we've already initialized the portfolio from localStorage
let hasInitializedPortfolio = false;

// Store IDs of permanently deleted items
const getPermanentlyDeletedItems = (): number[] => {
  const deletedItems = localStorage.getItem('permanentlyDeletedItems');
  return deletedItems ? JSON.parse(deletedItems) : [];
};

// Helper function to filter out permanently deleted items
const filterDeletedItems = (items: PortfolioItem[]): PortfolioItem[] => {
  const deletedIds = getPermanentlyDeletedItems();
  return items.filter(item => !deletedIds.includes(item.id));
};

/**
 * Loads portfolio items from localStorage if available, otherwise uses defaults
 * Excludes permanently deleted items
 */
export const loadPortfolioItems = (): PortfolioItem[] => {
  try {
    // Force refresh to include the new personalized gift project
    console.log('Force loading latest portfolio items including personalized gift project');
    
    // Get the latest default items and filter out permanently deleted ones
    const filteredDefaults = filterDeletedItems(defaultPortfolioItems);
    
    // Check if we have saved items
    const savedItems = localStorage.getItem('portfolioItems');
    
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      
      // Check if the personalized gift project (id: 14) exists
      const hasPersonalizedGiftProject = parsedItems.some((item: PortfolioItem) => item.id === 14);
      
      if (!hasPersonalizedGiftProject) {
        // Add the new project and save
        console.log('Adding personalized gift project to existing portfolio');
        const personalizedGiftProject = defaultPortfolioItems.find(item => item.id === 14);
        if (personalizedGiftProject) {
          const updatedItems = [...parsedItems, personalizedGiftProject];
          const finalItems = filterDeletedItems(updatedItems);
          localStorage.setItem('portfolioItems', JSON.stringify(finalItems));
          console.log(`Portfolio updated with ${finalItems.length} items including new project`);
          return finalItems;
        }
      }
      
      // Return existing items (filtered)
      const finalItems = filterDeletedItems(parsedItems);
      console.log(`Loaded ${finalItems.length} portfolio items from localStorage`);
      return finalItems;
    }
    
    // No saved items, use defaults
    console.log(`Initializing with ${filteredDefaults.length} default portfolio items`);
    localStorage.setItem('portfolioItems', JSON.stringify(filteredDefaults));
    return filteredDefaults;
    
  } catch (error) {
    console.error('Error loading portfolio items:', error);
    // In case of error, return defaults (filtered)
    return filterDeletedItems(defaultPortfolioItems);
  }
};

/**
 * Saves portfolio items to localStorage
 */
export const savePortfolioItems = (items: PortfolioItem[]): void => {
  try {
    console.log(`Saving ${items.length} portfolio items to localStorage`);
    localStorage.setItem('portfolioItems', JSON.stringify(items));
    
    // Dispatch a storage event so other components can listen for changes
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving portfolio items:', error);
  }
};

/**
 * Permanently delete a portfolio item by ID
 * This will prevent it from reappearing on reset
 */
export const permanentlyDeleteItem = (id: number): void => {
  try {
    // Get current list of permanently deleted items
    const deletedItems = getPermanentlyDeletedItems();
    
    // Add the new ID if it's not already in the list
    if (!deletedItems.includes(id)) {
      deletedItems.push(id);
      localStorage.setItem('permanentlyDeletedItems', JSON.stringify(deletedItems));
      console.log(`Item ${id} added to permanently deleted items list`);
    }
    
    // Also remove it from current items
    const currentItems = loadPortfolioItems();
    const updatedItems = currentItems.filter(item => item.id !== id);
    savePortfolioItems(updatedItems);
  } catch (error) {
    console.error('Error permanently deleting item:', error);
  }
};

/**
 * Force reload the portfolio with defaults
 * Will still exclude permanently deleted items
 */
export const resetToDefaults = (): PortfolioItem[] => {
  console.log('Resetting portfolio to defaults (excluding permanently deleted items)');
  const filteredDefaults = filterDeletedItems(defaultPortfolioItems);
  localStorage.setItem('portfolioItems', JSON.stringify(filteredDefaults));
  window.dispatchEvent(new Event('storage'));
  return filteredDefaults;
};

// Force clear and reload portfolio items on module initialization
console.log('Force refreshing portfolio with latest items including personalized gift project');
localStorage.removeItem('portfolioItems'); // Clear existing data
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
