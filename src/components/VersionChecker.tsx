
import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const VersionChecker = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  useEffect(() => {
    // Function to check for site updates
    const checkForUpdates = () => {
      const storedVersion = localStorage.getItem('current-site-version');
      const latestVersion = localStorage.getItem('site-version');
      
      // If we have a stored latest version and it's different from current version
      if (latestVersion && (!storedVersion || storedVersion !== latestVersion)) {
        setShowUpdatePrompt(true);
      }
    };
    
    // Check for updates on initial load
    checkForUpdates();
    
    // Store current version if not already stored
    if (!localStorage.getItem('current-site-version')) {
      const initialVersion = localStorage.getItem('site-version') || new Date().getTime().toString();
      localStorage.setItem('current-site-version', initialVersion);
    }
    
    // Set up interval to check for updates (every 5 minutes)
    const intervalId = setInterval(checkForUpdates, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle update action
  const handleUpdate = () => {
    // Update current version to latest version
    const latestVersion = localStorage.getItem('site-version');
    if (latestVersion) {
      localStorage.setItem('current-site-version', latestVersion);
    }
    
    // Clear cache and hard reload the page
    if ('caches' in window) {
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          return caches.delete(key);
        }));
      });
    }
    
    // Force reload the page with cache bypass
    window.location.reload(true);
  };
  
  // Return null if no update prompt needed
  if (!showUpdatePrompt) return null;
  
  return (
    <AlertDialog open={showUpdatePrompt} onOpenChange={setShowUpdatePrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            New Website Version Available
          </AlertDialogTitle>
          <AlertDialogDescription>
            A new version of this website is available. Update now to see the latest content and features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Later</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VersionChecker;
