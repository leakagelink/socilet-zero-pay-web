
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
    <div className="lg:hidden flex items-center gap-1">
      <Button 
        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 rounded-lg h-8 px-2.5 py-0 text-xs"
        onClick={() => handleNavigation('/#contact')}
      >
        <Phone size={14} className="mr-1" />
        <span>Contact</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-8 w-8"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-white shadow-md mt-0.5 py-1.5 z-50">
          <div className="grid grid-cols-2 gap-0.5 px-1.5">
            {navLinks.map((link) => (
              !link.hasDropdown ? (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-xs h-7 rounded-full ${
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
                <div key={link.name} className="relative group col-span-2 mb-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs h-7 rounded-full w-full justify-start ${
                      isActive(link.path) 
                        ? 'text-primary-600 bg-primary-50/70 font-medium' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    {link.name}
                  </Button>
                  
                  <div className="w-full pl-1.5">
                    <div className="grid grid-cols-2 gap-0.5">
                      {servicePages.map((service) => (
                        <Button
                          key={service.name}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLinkClick(service.href)}
                          className="text-xs justify-start h-6 py-0 text-gray-600 hover:bg-primary-50"
                        >
                          • {service.name}
                        </Button>
                      ))}
                    </div>
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
