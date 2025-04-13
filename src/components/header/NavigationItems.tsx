
import React from 'react';
import { useLocation } from 'react-router-dom';

export interface NavLink {
  name: string;
  href: string;
  path: string;
  hasDropdown?: boolean;
  isHighlighted?: boolean;
}

export interface ServicePage {
  name: string;
  href: string;
}

interface NavigationItemsProps {
  handleNavigation: (href: string) => void;
  isActive: (path: string) => boolean;
}

export const navLinks: NavLink[] = [
  { name: 'Home', href: '/', path: '/' },
  { name: 'Services', href: '/#services', path: '/', hasDropdown: true },
  { name: 'Portfolio', href: '/#portfolio', path: '/' },
  { name: 'Blog', href: '/blog', path: '/blog' },
  { name: 'Track Project', href: '/track-project', path: '/track-project' },
  { name: 'Affiliate', href: '/affiliate', path: '/affiliate', isHighlighted: true },
];

export const servicePages: ServicePage[] = [
  { name: 'Website Development', href: '/website-development' },
  { name: 'App Development', href: '/app-development' },
  { name: 'AI Spokesperson', href: '/ai-spokesperson' },
  { name: 'Business Profile Listing', href: '/business-profile' },
];

const NavigationItems: React.FC<NavigationItemsProps> = ({ handleNavigation, isActive }) => {
  return (
    <>
      {navLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleNavigation(link.href)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
            link.isHighlighted
              ? isActive(link.path)
                ? 'bg-purple-100 text-purple-700 font-semibold' 
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'
              : isActive(link.path) 
                ? 'text-primary-600 bg-primary-50 font-semibold' 
                : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
          }`}
        >
          {link.name}
        </button>
      ))}
    </>
  );
};

export default NavigationItems;
