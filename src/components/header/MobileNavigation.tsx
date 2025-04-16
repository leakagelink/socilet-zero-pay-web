
import React, { useState } from 'react';
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from './useNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    navLinks, 
    servicePages, 
    handleNavigation, 
    isActive 
  } = useNavigation();
  const isMobile = useIsMobile();

  const handleLinkClick = (href: string) => {
    handleNavigation(href);
    setIsMenuOpen(false);
  };

  return (
    <div className="lg:hidden w-full">
      {/* Top bar with contact button and menu toggle */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
        
        <Button 
          className="px-3 py-1 h-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 rounded-lg text-xs"
          onClick={() => handleNavigation('/#contact')}
        >
          <Phone size={14} className="mr-1" />
          <span>Contact</span>
        </Button>
      </div>
      
      {/* Collapsible navigation menu */}
      {isMenuOpen && (
        <nav className="w-full bg-white/95 rounded-md shadow-sm mt-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-1 p-2">
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
                <div key={link.name} className="relative group col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className={`text-xs px-2 py-1 h-auto rounded-full w-full justify-start ${
                      isActive(link.path) 
                        ? 'text-primary-600 bg-primary-50/70 font-medium' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    {link.name}
                  </Button>
                  
                  <div className="w-full mt-1 pl-4">
                    {servicePages.map((service) => (
                      <Button
                        key={service.name}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLinkClick(service.href)}
                        className="text-xs w-full justify-start px-2 py-1 h-auto text-gray-600 hover:bg-primary-50"
                      >
                        • {service.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileNavigation;
