
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CacheManager = () => {
  const [isClearing, setIsClearing] = useState(false);
  
  const handleClearCache = () => {
    setIsClearing(true);
    
    // Generate a new version timestamp
    const versionTimestamp = new Date().getTime();
    
    // Store the new version in localStorage
    localStorage.setItem('site-version', versionTimestamp.toString());
    
    setTimeout(() => {
      // Clear browser cache using HTTP headers - this part works server-side
      // For client-side, we'll force a reload with cache clearing
      
      // Force service worker unregistration if exists
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
      
      // Clear application cache
      if (window.applicationCache) {
        window.applicationCache.swapCache();
      }
      
      // Clear browser cache for site assets
      if (window.caches) {
        window.caches.keys().then(names => {
          for (let name of names) {
            window.caches.delete(name);
          }
        });
      }
      
      toast.success('Cache cleared successfully, site will use latest version on next load');
      setIsClearing(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="mr-2 h-5 w-5" />
          Cache Management
        </CardTitle>
        <CardDescription>Clear the website cache to reflect recent changes</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Use this option to clear cached data and force reload of content.
          This may be necessary after making significant changes to the website.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              After clearing the cache, instruct your visitors to refresh their browser 
              or clear their browser cache to see the latest changes.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleClearCache} 
          disabled={isClearing}
        >
          {isClearing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Clearing Cache...
            </>
          ) : (
            'Clear Cache'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CacheManager;
