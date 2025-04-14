
import { useNavigate, useLocation } from 'react-router-dom';

type NavLink = {
  name: string;
  href: string;
  path: string;
  hasDropdown?: boolean;
  isHighlighted?: boolean;
};

type ServicePage = {
  name: string;
  href: string;
};

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Services', href: '/#services', path: '/', hasDropdown: true },
    { name: 'Portfolio', href: '/#portfolio', path: '/' },
    { name: 'Blog', href: '/blog', path: '/blog' },
    { name: 'Track Project', href: '/track-project', path: '/track-project' },
    { name: 'Affiliate', href: '/affiliate', path: '/affiliate', isHighlighted: true },
  ];

  const servicePages: ServicePage[] = [
    { name: 'Website Development', href: '/website-development' },
    { name: 'App Development', href: '/app-development' },
    { name: 'AI Spokesperson', href: '/ai-spokesperson' },
    { name: 'Business Profile Listing', href: '/business-profile' },
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

  return {
    navLinks,
    servicePages,
    handleNavigation,
    isActive
  };
};
