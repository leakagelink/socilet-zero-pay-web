
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
        src="/lovable-uploads/ccd00181-707e-4b7a-8083-b17b0673e60b.png" 
        alt="Socilet Logo" 
        className={`${isMobile ? 'h-10' : 'h-14'} drop-shadow-sm`}
      />
    </div>
  );
};

export default Logo;
