export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  url?: string;
  isReactProject?: boolean;
  isWordPressProject?: boolean;
  isUnderDevelopment?: boolean;
}

// Default portfolio items
export const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Bharat Startup Solution',
    description: 'A complete startup ecosystem platform built with React and modern technologies.',
    image: '/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png',
    category: 'websites',
    url: 'https://bharatstartupsolution.com',
    isReactProject: true,
  },
  {
    id: 2,
    title: 'भारत का No.1 Personalized Gift Platform',
    description: 'Custom gift platform with personalization features.',
    image: '/lovable-uploads/136bb329-dddb-471c-90e4-a91b112cdacf.png',
    category: 'websites',
    url: 'https://example.com',
    isReactProject: true,
  },
  {
    id: 3,
    title: 'Business Directory Website',
    description: 'Professional business directory built with WordPress.',
    image: '/lovable-uploads/1b9d66b2-fe2e-4972-a39c-cbbc782ba6e2.png',
    category: 'business',
    isWordPressProject: true,
  },
  {
    id: 4,
    title: 'E-Commerce Store',
    description: 'Modern e-commerce platform with seamless checkout.',
    image: '/lovable-uploads/2ee68a1b-0ec0-47b8-b622-98ff6c6141b3.png',
    category: 'websites',
    isWordPressProject: true,
  },
  {
    id: 5,
    title: 'Mobile App UI',
    description: 'Cross-platform mobile application design.',
    image: '/lovable-uploads/30524eb0-f4b1-469b-af5f-cf1018d53167.png',
    category: 'apps',
    isReactProject: true,
  },
  {
    id: 6,
    title: 'AI Spokesperson Demo',
    description: 'AI-powered video spokesperson for business.',
    image: '/lovable-uploads/4d1b600f-6762-416e-8778-c3d2777a5d54.png',
    category: 'ai',
    isReactProject: true,
  },
];
