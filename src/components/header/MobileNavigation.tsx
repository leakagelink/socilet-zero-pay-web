
import React, { useState } from 'react';
import { Menu, Phone, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (href: string) => {
    handleNavigation(href);
    handleClose();
  };

  return (
    <div className="lg:hidden flex items-center">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="border-none hover:bg-gray-100 ml-auto">
            <Menu className="h-6 w-6 text-primary-600" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className={`${isMobile ? 'w-full' : 'w-[300px] sm:w-[400px]'} bg-gradient-to-b from-white to-blue-50`}>
          <div className="flex justify-end">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          <nav className="flex flex-col gap-4 mt-4">
            {navLinks.map((link) => (
              <div key={link.name} className="w-full">
                {link.hasDropdown ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className={`text-lg px-4 py-3 rounded-lg transition-all hover:translate-x-1 w-full text-left cursor-pointer flex justify-between items-center ${
                        isActive(link.path) 
                          ? 'text-primary-600 bg-primary-50/70 font-medium' 
                          : 'text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      {link.name}
                      <ChevronDown size={18} className="ml-2" />
                    </button>
                    <div className="ml-4 mt-2 space-y-2 border-l border-gray-200 pl-4">
                      {servicePages.map((service) => (
                        <button
                          key={service.name}
                          onClick={() => handleLinkClick(service.href)}
                          className="text-base px-4 py-2 rounded-lg transition-all hover:translate-x-1 w-full text-left text-gray-700 hover:bg-primary-50"
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className={`text-lg px-4 py-3 rounded-lg transition-all hover:translate-x-1 w-full text-left cursor-pointer ${
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
                  </button>
                )}
              </div>
            ))}
            <div className="mt-4">
              <Button 
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 gap-2 rounded-lg cursor-pointer"
                onClick={() => handleLinkClick('/#contact')}
              >
                <Phone size={16} />
                <span>Get Started</span>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <Button 
        className="ml-2 px-3 py-1 h-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 rounded-lg text-xs"
        onClick={() => handleNavigation('/#contact')}
      >
        <Phone size={14} className="mr-1" />
        <span className="sr-only sm:not-sr-only">Contact</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
