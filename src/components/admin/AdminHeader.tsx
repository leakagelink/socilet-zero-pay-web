
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  onLogout: () => void;
}

// Custom icons for Bing and Yandex since they're not in Lucide
const BingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
    <path d="M5.06 3L5 6.75l4.94 1.69v4.87L3.5 10.5v7.13L10 21l9.5-5.25v-6l-9.5 3.25V9.13l5-1.69V3h-9.94z" />
  </svg>
);

const YandexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
    <path d="M2 11.583h2.981v5.834h2.003v-5.834h2.981v-1.75H2v1.75zm17.257 4.063l-3.023-5.834h-2.796v7.583h1.935v-4.195l2.889 4.195h2.034v-7.583h-1.94v5.834h-.099z"/>
    <path d="M21.268 3.328h-4.899l-3.095 5.139v5.116h2.132v-5.116l1.336-2.267h2.777c1.007 0 1.683.797 1.683 1.697v5.686h2.132V7.474c0-2.267-1.883-4.146-4.066-4.146z"/>
  </svg>
);

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:text-secondary transition-colors flex items-center">
                      <Globe className="w-4 h-4 mr-1" /> Search Tools
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                      <a 
                        href="https://search.google.com/search-console" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <Globe className="w-4 h-4 mr-2" /> Google Search Console
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a 
                        href="https://www.bing.com/webmasters" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <BingIcon /> Bing Webmaster Tools
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a 
                        href="https://webmaster.yandex.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <YandexIcon /> Yandex Webmaster
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
