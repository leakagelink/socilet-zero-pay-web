
// Re-export everything from the refactored files
export type { PortfolioItem } from './portfolio/types';
export { 
  loadPortfolioItems,
  savePortfolioItems,
  portfolioItems,
  resetToDefaults 
} from './portfolio/portfolioService';
