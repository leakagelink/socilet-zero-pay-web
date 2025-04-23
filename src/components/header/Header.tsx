
import React, { useState, useEffect } from 'react';
import { useNavigation } from './useNavigation';
import Logo from './Logo';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { handleNavigation } = useNavigation();

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

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-0.5 md:py-2' 
          : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 backdrop-blur-md py-0.5 md:py-2'
      }`}
    >
      <div className="w-full px-1 md:px-4 max-w-screen mx-auto">
        <div className="flex justify-between items-center">
          <Logo onClick={() => handleNavigation('/')} />
          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
