
import { PortfolioItem } from './types';
import { defaultPortfolioItems } from './portfolioItems';

// Track if we've already initialized the portfolio from localStorage
let hasInitializedPortfolio = false;

/**
 * Loads portfolio items from localStorage if available, otherwise uses defaults
 */
export const loadPortfolioItems = (): PortfolioItem[] => {
  try {
    // Check if we have already saved portfolio items
    const savedItems = localStorage.getItem('portfolioItems');
    
    // Log for debugging
    console.log(`Loading portfolio items: ${savedItems ? 'Found saved items' : 'No saved items found'}`);
    
    // If there are saved items, return those
    if (savedItems) {
      hasInitializedPortfolio = true;
      const parsedItems = JSON.parse(savedItems);
      console.log(`Loaded ${parsedItems.length} portfolio items from localStorage`);
      
      // Ensure all default items are present (especially the ones you mentioned)
      const existingIds = new Set(parsedItems.map(item => item.id));
      const missingDefaults = defaultPortfolioItems.filter(item => !existingIds.has(item.id));
      
      if (missingDefaults.length > 0) {
        console.log(`Adding ${missingDefaults.length} missing default items to portfolio`);
        const updatedItems = [...parsedItems, ...missingDefaults];
        localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
      
      return parsedItems;
    }
    
    // If we haven't initialized yet, use defaults and save them
    if (!hasInitializedPortfolio) {
      hasInitializedPortfolio = true;
      console.log(`Initializing with ${defaultPortfolioItems.length} default portfolio items`);
      localStorage.setItem('portfolioItems', JSON.stringify(defaultPortfolioItems));
      return defaultPortfolioItems;
    }
    
    // Return empty array if items were deleted and no saved data exists
    return [];
  } catch (error) {
    console.error('Error loading portfolio items:', error);
    // In case of error, return defaults
    return defaultPortfolioItems;
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
 * Force reload the portfolio with defaults
 */
export const resetToDefaults = (): PortfolioItem[] => {
  console.log('Resetting portfolio to defaults');
  localStorage.setItem('portfolioItems', JSON.stringify(defaultPortfolioItems));
  window.dispatchEvent(new Event('storage'));
  return defaultPortfolioItems;
};

// Ensure portfolio items are loaded on module initialization
// This helps with initial rendering
console.log('Initializing portfolio service module');
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
