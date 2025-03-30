
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
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
          : 'bg-gradient-to-r from-white/80 to-white/95 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
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
        <nav className="hidden md:flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <NavigationMenuLink
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary-600 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
                      isActive(link.path) ? 'text-primary-600 after:scale-x-100' : 'text-gray-700'
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
            className="bg-primary-600 hover:bg-primary-700 gap-2 rounded-full shadow-md hover:shadow-lg transition-all ml-4"
            onClick={() => handleNavigation('/#contact')}
          >
            <Phone size={16} />
            <span>Get Started</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors py-3 px-4 rounded-md ${
                  isActive(link.path) ? 'text-primary-600 bg-gray-50' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <Button 
                className="bg-primary-600 hover:bg-primary-700 w-full flex items-center justify-center gap-2 rounded-md shadow-md"
                onClick={() => handleNavigation('/#contact')}
              >
                <Phone size={16} />
                <span>Get Started</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
