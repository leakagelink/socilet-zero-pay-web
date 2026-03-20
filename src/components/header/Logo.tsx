
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  onClick: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center transition-transform hover:scale-105 duration-300 cursor-pointer ${isMobile ? 'ml-0' : ''}`}
    >
      <img 
        src="/socilet-logo.png" 
        alt="Socilet Logo" 
        className={`${isMobile ? 'h-8' : 'h-14'} drop-shadow-sm`}
      />
    </div>
  );
};

export default Logo;
