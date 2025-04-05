
import { PortfolioItem } from './types';
import { defaultPortfolioItems } from './portfolioItems';

// Track if we've already initialized the portfolio from localStorage
let hasInitializedPortfolio = false;

/**
 * Loads portfolio items from localStorage if available, otherwise uses defaults
 */
export const loadPortfolioItems = (): PortfolioItem[] => {
  // Check if we have already saved portfolio items
  const savedItems = localStorage.getItem('portfolioItems');
  
  // If there are saved items, return those
  if (savedItems) {
    hasInitializedPortfolio = true;
    return JSON.parse(savedItems);
  }
  
  // If we haven't initialized yet, use defaults and save them
  if (!hasInitializedPortfolio) {
    hasInitializedPortfolio = true;
    localStorage.setItem('portfolioItems', JSON.stringify(defaultPortfolioItems));
    return defaultPortfolioItems;
  }
  
  // Return empty array if items were deleted and no saved data exists
  return [];
};

/**
 * Saves portfolio items to localStorage
 */
export const savePortfolioItems = (items: PortfolioItem[]): void => {
  localStorage.setItem('portfolioItems', JSON.stringify(items));
  
  // Dispatch a storage event so other components can listen for changes
  window.dispatchEvent(new Event('storage'));
};

// Initialize and export the portfolio items
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
