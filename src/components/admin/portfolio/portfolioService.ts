
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

// Ensure portfolio items are loaded on module initialization
// This helps with initial rendering
console.log('Initializing portfolio service module');
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
