
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
    // Check if we have already saved portfolio items
    const savedItems = localStorage.getItem('portfolioItems');
    
    // Log for debugging
    console.log(`Loading portfolio items: ${savedItems ? 'Found saved items' : 'No saved items found'}`);
    
    // If there are saved items, check if they include the new personalized gift project
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      
      // Check if the new project (id: 14) exists
      const hasPersonalizedGiftProject = parsedItems.some((item: PortfolioItem) => item.id === 14);
      
      if (!hasPersonalizedGiftProject) {
        // Add the new project and save
        console.log('Adding new personalized gift project to existing items');
        const updatedItems = [...parsedItems, defaultPortfolioItems.find(item => item.id === 14)].filter(Boolean);
        const filteredItems = filterDeletedItems(updatedItems);
        localStorage.setItem('portfolioItems', JSON.stringify(filteredItems));
        return filteredItems;
      }
      
      hasInitializedPortfolio = true;
      console.log(`Loaded ${parsedItems.length} portfolio items from localStorage`);
      
      // Filter out permanently deleted items
      return filterDeletedItems(parsedItems);
    }
    
    // If we haven't initialized yet, use defaults and save them (excluding permanently deleted ones)
    if (!hasInitializedPortfolio) {
      hasInitializedPortfolio = true;
      console.log(`Initializing with ${defaultPortfolioItems.length} default portfolio items`);
      
      // Filter out permanently deleted items from defaults
      const filteredDefaults = filterDeletedItems(defaultPortfolioItems);
      localStorage.setItem('portfolioItems', JSON.stringify(filteredDefaults));
      return filteredDefaults;
    }
    
    // Return empty array if items were deleted and no saved data exists
    return [];
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

// Ensure portfolio items are loaded on module initialization
// This helps with initial rendering
console.log('Initializing portfolio service module');
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
