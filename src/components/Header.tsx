
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const servicePages = [
    { name: 'Website Development', href: '/website-development' },
    { name: 'App Development', href: '/app-development' },
    { name: 'AI Spokesperson', href: '/ai-spokesperson' },
    { name: 'Business Profile Listing', href: '/business-profile' },
  ];

  const navLinks = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Services', href: '/#services', path: '/', hasDropdown: true },
    { name: 'Portfolio', href: '/#portfolio', path: '/' },
    { name: 'Blog', href: '/blog', path: '/blog' },
    { name: 'Track Project', href: '/track-project', path: '/track-project' },
    { name: 'Affiliate', href: '/affiliate', path: '/affiliate', isHighlighted: true },
    // Removed the Contact link from here
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#') && location.pathname === '/') {
      // If it's a hash link and we're on the homepage, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.includes('#') && !href.startsWith('#')) {
      // If it contains a hash but isn't just a hash (like "/#services")
      const path = href.split('#')[0];
      navigate(path);
      setTimeout(() => {
        const hash = href.split('#')[1];
        const element = document.querySelector(`#${hash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Regular navigation
      navigate(href);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.includes(path);
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 backdrop-blur-md py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className={`flex items-center transition-transform hover:scale-105 duration-300 cursor-pointer ${isMobile ? 'ml-0' : ''}`}
          >
            <img 
              src="/lovable-uploads/ccd00181-707e-4b7a-8083-b17b0673e60b.png" 
              alt="Socilet Logo" 
              className={`${isMobile ? 'h-10' : 'h-14'} drop-shadow-sm`}
            />
          </div>

          {/* Desktop Navigation */}
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
                      <button
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-none hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={`${isMobile ? 'w-full' : 'w-[300px] sm:w-[400px]'} bg-gradient-to-b from-white to-blue-50`}>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
