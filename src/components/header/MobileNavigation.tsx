
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Phone, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { servicePages, navLinks } from './NavigationItems';

interface MobileNavigationProps {
  handleNavigation: (href: string) => void;
  isActive: (path: string) => boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ handleNavigation, isActive }) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="border-none hover:bg-gray-100">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-white to-blue-50">
          <nav className="flex flex-col gap-4 mt-8">
            {navLinks.map((link) => (
              <div key={link.name} className="w-full">
                {link.hasDropdown ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleNavigation(link.href)}
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
                          onClick={() => handleNavigation(service.href)}
                          className="text-base px-4 py-2 rounded-lg transition-all hover:translate-x-1 w-full text-left text-gray-700 hover:bg-primary-50"
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(link.href)}
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
                onClick={() => handleNavigation('/#contact')}
              >
                <Phone size={16} />
                <span>Get Started</span>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
