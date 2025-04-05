
export type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  url?: string;
  isReactProject?: boolean;
};

// Initial default portfolio items 
const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'E-commerce Website',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400',
    description: 'A full-featured e-commerce platform with payment integration and inventory management.',
    url: ''
  },
  {
    id: 2,
    title: 'Restaurant App',
    category: 'apps',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=400',
    description: 'Mobile application for a restaurant chain with online ordering and table reservation.',
    url: ''
  },
  {
    id: 3,
    title: 'Corporate AI Presenter',
    category: 'ai',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=400',
    description: 'Custom AI spokesperson for corporate presentations and marketing videos.',
    url: ''
  },
  {
    id: 4,
    title: 'Local Business Directory',
    category: 'business',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
    description: 'Comprehensive business listings across multiple platforms for local businesses.',
    url: ''
  },
  {
    id: 5,
    title: 'Educational Platform',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400',
    description: 'Online learning platform with course management and virtual classrooms.',
    url: ''
  },
  {
    id: 6,
    title: 'Fitness Tracking App',
    category: 'apps',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400',
    description: 'Mobile app for tracking workouts, nutrition, and fitness goals.',
    url: ''
  },
  {
    id: 7,
    title: 'Bharat Startup Solution',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400',
    description: 'MSMEs & Startups solution funding website built with React and modern frontend technologies. Completed on March 30, 2025.',
    url: 'https://bharatstartupsolution.com/',
    isReactProject: true
  },
  {
    id: 8,
    title: 'Shaswat Initial Support Services',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1661956600684-97d3a4320e45?auto=format&fit=crop&w=600&h=400',
    description: 'Website development company based in Gujarat. Completed on December 15, 2024.',
    url: 'https://shaswatinitialsupportservices.com/'
  },
  {
    id: 9,
    title: 'DEVAXI Automation',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=400',
    description: 'Empowering industries with cutting-edge solutions in Instrumentation and DCS execution. Expertise in Technical Services, Manpower Services, and Technical Training. Completed on August 14, 2024.',
    url: 'https://devaxi-automation.com/'
  },
  {
    id: 10,
    title: 'Rose Energy Group',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&h=400',
    description: 'Independent exploration and production company focused on responsibly producing energy supplies and contributing to domestic energy security. Based in Oceanside, CA. Completed on September 20, 2024.',
    url: 'https://roseenergygroup.com/'
  },
  {
    id: 11,
    title: 'Code Formatter Pro',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&h=400',
    description: 'A simple, elegant tool to format HTML, CSS, JavaScript and Python code built using React. Completed on March 30, 2025.',
    url: 'https://codeformatter.pro/',
    isReactProject: true
  },
  {
    id: 12,
    title: 'VRT9 Trading',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&h=400',
    description: 'India\'s Most Trusted Stock Market Institute making learning and teaching more effective with active participation and student collaboration. Completed on October 20, 2024.',
    url: 'https://vrt9trading.com/'
  },
  {
    id: 13,
    title: 'PinnacleSyncTech',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=600&h=400',
    description: 'Welcome to PinnacleSyncTech, where we bridge the gap between top-tier IT talent and innovative companies striving for excellence. Founded on a commitment to excellence and a passion for technology, we specialize in providing exceptional IT staffing solutions. Completed on April 26, 2024.',
    url: 'https://pinnaclesynctech.com/'
  },
  {
    id: 14,
    title: 'ICARUS HR',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&h=400',
    description: 'Welcome to ICARUS HR, where talent and opportunity converge to create impactful careers and thriving teams. At ICARUS HR, we believe recruitment is more than just filling roles—it\'s about forging meaningful connections between visionary companies and exceptional talent. Completed on November 24, 2024.',
    url: 'https://icarushr.com/'
  },
  {
    id: 15,
    title: 'Amazon Pallets Liquidation',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&h=400',
    description: 'For over 10 years, Amazon pallets liquidation has been a leading provider of customer returns, overstock, and end-of-life products sourced from major retailers and manufacturers. We offer a diverse range of liquidation inventory, including electronics, home goods, clothing, toys, general merchandise and much more. Completed on October 07, 2024.',
    url: 'https://amazonpalletsliquidation.com/'
  },
  {
    id: 16,
    title: 'Solar Savings Calculator',
    category: 'websites',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&h=400',
    description: 'Calculate your return on investment for solar panel installation. A React-based tool helping users determine savings and ROI from switching to solar energy. Completed on March 30, 2025.',
    url: 'https://solarsavingscalculator.site/',
    isReactProject: true
  },
];

// Track if we've already initialized the portfolio from localStorage
let hasInitializedPortfolio = false;

// Load portfolio items from localStorage if available, otherwise use defaults
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

// Save portfolio items to localStorage
export const savePortfolioItems = (items: PortfolioItem[]): void => {
  localStorage.setItem('portfolioItems', JSON.stringify(items));
};

// Export the portfolio items from the loadPortfolioItems function
export const portfolioItems: PortfolioItem[] = loadPortfolioItems();
