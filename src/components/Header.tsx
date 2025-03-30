
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

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

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center" onClick={() => handleNavigation('/')}>
          <img src="/logo.png" alt="Socilet Logo" className="h-10" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(link.href);
              }}
              className={`text-gray-700 hover:text-primary-600 font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${location.pathname === link.path ? 'text-primary-600 after:scale-x-100' : ''}`}
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-primary-600 hover:bg-primary-700 gap-2" onClick={() => handleNavigation('/#contact')}>
            <Phone size={16} />
            <span>Get Started</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 border-b border-gray-100 ${location.pathname === link.path ? 'text-primary-600' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            <Button 
              className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
              onClick={() => handleNavigation('/#contact')}
            >
              <Phone size={16} />
              <span>Get Started</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
