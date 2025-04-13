
import React from 'react';

interface LogoProps {
  handleNavigation: (href: string) => void;
}

const Logo: React.FC<LogoProps> = ({ handleNavigation }) => {
  return (
    <div 
      onClick={() => handleNavigation('/')}
      className="flex items-center transition-transform hover:scale-105 duration-300 cursor-pointer" 
    >
      <img 
        src="/lovable-uploads/ccd00181-707e-4b7a-8083-b17b0673e60b.png" 
        alt="Socilet Logo" 
        className="h-14 drop-shadow-sm" 
      />
    </div>
  );
};

export default Logo;
