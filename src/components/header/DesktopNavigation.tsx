
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import NavigationItems, { navLinks, servicePages } from './NavigationItems';

interface DesktopNavigationProps {
  handleNavigation: (href: string) => void;
  isActive: (path: string) => boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ handleNavigation, isActive }) => {
  return (
    <div className="hidden lg:flex items-center space-x-1">
      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.name}>
              {link.hasDropdown ? (
                <>
                  <NavigationMenuTrigger 
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                      isActive(link.path) 
                        ? 'text-primary-600 bg-primary-50 font-semibold' 
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    onClick={() => link.href !== '#' ? handleNavigation(link.href) : null}
                  >
                    {link.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {servicePages.map((service) => (
                        <li key={service.name}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => handleNavigation(service.href)}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary-50 hover:text-primary-700 focus:bg-primary-50 focus:text-primary-700 w-full text-left"
                            >
                              <div className="text-sm font-medium">{service.name}</div>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationItems handleNavigation={handleNavigation} isActive={isActive} />
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
      <Button 
        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 gap-2 rounded-full shadow-md hover:shadow-lg transition-all ml-4 cursor-pointer"
        onClick={() => handleNavigation('/#contact')}
      >
        <Phone size={16} className="animate-pulse" />
        <span>Get Started</span>
      </Button>
    </div>
  );
};

export default DesktopNavigation;
