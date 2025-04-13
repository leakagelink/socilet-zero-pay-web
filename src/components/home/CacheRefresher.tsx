
import { useEffect } from 'react';

const CacheRefresher: React.FC = () => {
  useEffect(() => {
    if (!localStorage.getItem('site-version')) {
      localStorage.setItem('site-version', new Date().getTime().toString());
    }
    
    const forceCacheRefresh = new URLSearchParams(window.location.search).get('refresh-cache');
    if (forceCacheRefresh === 'true') {
      const latestVersion = localStorage.getItem('site-version');
      if (latestVersion) {
        localStorage.setItem('current-site-version', latestVersion);
      }
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      console.log('Cache refresh requested, clearing caches...');
    }
  }, []);

  return null; // This component doesn't render anything
};

export default CacheRefresher;
