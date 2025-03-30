
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const navLinks = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Services', href: '/#services', path: '/' },
    { name: 'Portfolio', href: '/#portfolio', path: '/' },
    { name: 'Blog', href: '/blog', path: '/blog' },
    { name: 'Track Project', href: '/track-project', path: '/track-project' },
    { name: 'Affiliate', href: '/affiliate', path: '/affiliate' },
    { name: 'Contact', href: '/#contact', path: '/' },
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
          <a 
            href="/" 
            className="flex items-center transition-transform hover:scale-105 duration-300" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
          >
            <img 
              src="/lovable-uploads/ccd00181-707e-4b7a-8083-b17b0673e60b.png" 
              alt="Socilet Logo" 
              className="h-14 drop-shadow-sm" 
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-primary-50 hover:text-primary-600 relative ${
                        isActive(link.path) 
                          ? 'text-primary-600 bg-primary-50 font-semibold' 
                          : 'text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(link.href);
                      }}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button 
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 gap-2 rounded-full shadow-md hover:shadow-lg transition-all ml-4"
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-white to-blue-50">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`text-lg px-4 py-3 rounded-lg transition-all hover:bg-primary-50 hover:translate-x-1 ${
                        isActive(link.path) 
                          ? 'text-primary-600 bg-primary-50/70 font-medium' 
                          : 'text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(link.href);
                      }}
                    >
                      {link.name}
                    </a>
                  ))}
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:opacity-90 gap-2 rounded-lg"
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
