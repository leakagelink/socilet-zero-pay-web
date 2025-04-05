
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
import { toast } from 'sonner';

const VersionChecker = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  useEffect(() => {
    // Function to check for site updates
    const checkForUpdates = () => {
      const storedVersion = localStorage.getItem('current-site-version');
      const latestVersion = localStorage.getItem('site-version');
      
      // If we have a stored latest version and it's different from current version
      if (latestVersion && (!storedVersion || storedVersion !== latestVersion)) {
        console.log(`Version mismatch detected. Current: ${storedVersion}, Latest: ${latestVersion}`);
        setShowUpdatePrompt(true);
        
        // Show a toast notification about the update
        toast.info('एक नया अपडेट उपलब्ध है! कृपया पेज रीफ्रेश करें।', {
          duration: 10000,
          action: {
            label: 'अपडेट करें',
            onClick: () => handleUpdate()
          }
        });
      }
    };
    
    // Store current version if not already stored
    if (!localStorage.getItem('current-site-version')) {
      const initialVersion = localStorage.getItem('site-version') || new Date().getTime().toString();
      localStorage.setItem('current-site-version', initialVersion);
    }
    
    // Check for updates on initial load
    checkForUpdates();
    
    // Set up interval to check for updates more frequently (every 30 seconds)
    const intervalId = setInterval(checkForUpdates, 30 * 1000);
    
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
    
    // Add refresh-cache=true to force cache clearing
    const url = new URL(window.location.href);
    url.searchParams.set('refresh-cache', 'true');
    window.location.href = url.toString();
  };
  
  // Force hard reload with cache bypass
  const forceHardReload = () => {
    // Clear cache and hard reload the page
    if ('caches' in window) {
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          return caches.delete(key);
        }));
      });
    }
    
    // Force reload the page with cache bypass
    window.location.reload();
  };
  
  // Return null if no update prompt needed
  if (!showUpdatePrompt) return null;
  
  return (
    <>
      <AlertDialog open={showUpdatePrompt} onOpenChange={setShowUpdatePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              वेबसाइट का नया वर्शन उपलब्ध है
            </AlertDialogTitle>
            <AlertDialogDescription>
              इस वेबसाइट का एक नया वर्शन उपलब्ध है। नवीनतम सामग्री और सुविधाओं को देखने के लिए अभी अपडेट करें।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>बाद में</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              अभी अपडेट करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Fixed button in bottom right corner for manual refresh */}
      <div className="fixed bottom-24 right-4 z-40">
        <Button 
          size="sm"
          variant="outline" 
          className="bg-white shadow-md border-primary-100 text-primary-600 hover:bg-primary-50 rounded-full"
          onClick={forceHardReload}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          रीफ्रेश करें
        </Button>
      </div>
    </>
  );
};

export default VersionChecker;
