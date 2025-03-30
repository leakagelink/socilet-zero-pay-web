
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-primary-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/admin" className="text-xl font-bold">Socilet Admin</Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-secondary transition-colors">View Site</Link></li>
              <li>
                <a 
                  href="https://search.google.com/search-console" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors flex items-center"
                >
                  <Globe className="w-4 h-4 mr-1" /> Search Console
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="text-white hover:bg-primary-700"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
