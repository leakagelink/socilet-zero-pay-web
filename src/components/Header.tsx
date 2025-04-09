import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavLinkProps {
  to: string;
  scrolled: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, scrolled, children }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `relative text-sm font-medium transition-colors ${
        isActive ? 'text-primary-600' : scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-300 hover:text-white'
      }`
    }
  >
    {children}
  </RouterNavLink>
);

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="block py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
    {children}
  </Link>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/ccd00181-707e-4b7a-8083-b17b0673e60b.png" 
              alt="Socilet Logo" 
              className="h-10 w-auto" 
            />
            <span className={`font-bold text-xl ml-2 ${scrolled ? 'text-primary-700' : 'text-gray-800'}`}>Socilet</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" scrolled={scrolled}>Home</NavLink>
            <NavLink to="/website-development" scrolled={scrolled}>Website</NavLink>
            <NavLink to="/app-development" scrolled={scrolled}>App</NavLink>
            <NavLink to="/tools" scrolled={scrolled}>Tools</NavLink>
            <NavLink to="/blog" scrolled={scrolled}>Blog</NavLink>
            <NavLink to="/track-project" scrolled={scrolled}>Track Project</NavLink>
            
            <NavLink to="/affiliate" scrolled={scrolled}>
              <div className="flex items-center">
                <span>Affiliate</span>
                <Badge className="ml-2" variant="success">New</Badge>
              </div>
            </NavLink>
          </nav>
          
          {/* CTA Button */}
          <Link 
            to="/zero-advance-payment" 
            className={`hidden md:block px-4 py-2 rounded-md text-white font-medium transition-colors ${
              scrolled ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-600/90 hover:bg-primary-600'
            }`}
          >
            Zero Advance Payment
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-2 px-4 flex flex-col space-y-2">
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/website-development" onClick={() => setIsMobileMenuOpen(false)}>Website</MobileNavLink>
                <MobileNavLink to="/app-development" onClick={() => setIsMobileMenuOpen(false)}>App</MobileNavLink>
                <MobileNavLink to="/tools" onClick={() => setIsMobileMenuOpen(false)}>Tools</MobileNavLink>
                <MobileNavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
                <MobileNavLink to="/track-project" onClick={() => setIsMobileMenuOpen(false)}>Track Project</MobileNavLink>
                <MobileNavLink to="/affiliate" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <span>Affiliate</span>
                    <Badge className="ml-2" variant="success">New</Badge>
                  </div>
                </MobileNavLink>
                <Link 
                  to="/zero-advance-payment" 
                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-center mt-2" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Zero Advance Payment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
