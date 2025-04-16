
import React from 'react';
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from './useNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation = () => {
  const { 
    navLinks, 
    servicePages, 
    handleNavigation, 
    isActive 
  } = useNavigation();
  const isMobile = useIsMobile();

  const handleLinkClick = (href: string) => {
    handleNavigation(href);
  };

  return (
    <div className="lg:hidden w-full">
      {/* Top section with contact button */}
      <div className="flex justify-end items-center mb-2">
        <Button 
          className="px-3 py-1 h-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 rounded-lg text-xs"
          onClick={() => handleNavigation('/#contact')}
        >
          <Phone size={14} className="mr-1" />
          <span>Contact</span>
        </Button>
      </div>
      
      {/* Always visible navigation */}
      <nav className="w-full bg-white/95 rounded-md shadow-sm">
        <div className="flex flex-wrap justify-center gap-1 p-1">
          {navLinks.map((link) => (
            !link.hasDropdown ? (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                onClick={() => handleLinkClick(link.href)}
                className={`text-xs px-2 py-1 h-auto rounded-full ${
                  link.isHighlighted
                    ? isActive(link.path) 
                      ? 'text-purple-700 bg-purple-100/70 font-medium' 
                      : 'text-purple-600 hover:bg-purple-50'
                    : isActive(link.path) 
                      ? 'text-primary-600 bg-primary-50/70 font-medium' 
                      : 'text-gray-700 hover:bg-primary-50'
                }`}
              >
                {link.name}
              </Button>
            ) : (
              <div key={link.name} className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-xs px-2 py-1 h-auto rounded-full flex items-center ${
                    isActive(link.path) 
                      ? 'text-primary-600 bg-primary-50/70 font-medium' 
                      : 'text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  {link.name}
                  <ChevronDown size={12} className="ml-1" />
                </Button>
                
                <div className="absolute hidden group-hover:block z-10 w-40 mt-1 bg-white rounded-md shadow-lg">
                  {servicePages.map((service) => (
                    <Button
                      key={service.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLinkClick(service.href)}
                      className="text-xs w-full justify-start px-3 py-2 text-gray-700 hover:bg-primary-50"
                    >
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
