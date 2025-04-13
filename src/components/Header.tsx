
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';

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
          <Logo handleNavigation={handleNavigation} />
          <DesktopNavigation 
            handleNavigation={handleNavigation} 
            isActive={isActive} 
          />
          <MobileNavigation 
            handleNavigation={handleNavigation} 
            isActive={isActive} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
