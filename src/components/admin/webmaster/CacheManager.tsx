
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
import { RefreshCw, Clock, Copy } from 'lucide-react';
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
      
      toast.success('कैश सफलतापूर्वक साफ़ किया गया, अगली लोडिंग पर साइट नवीनतम संस्करण का उपयोग करेगी', {
        duration: 5000
      });
      setIsClearing(false);
    }, 1500);
  };
  
  const copyRefreshLink = () => {
    const currentUrl = window.location.origin;
    const refreshUrl = `${currentUrl}?refresh-cache=true`;
    
    navigator.clipboard.writeText(refreshUrl).then(() => {
      toast.success('कैश रीफ्रेश लिंक कॉपी किया गया');
    }).catch(err => {
      toast.error('कॉपी करने में त्रुटि');
      console.error('Error copying refresh link:', err);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="mr-2 h-5 w-5" />
          कैश प्रबंधन
        </CardTitle>
        <CardDescription>हाल के परिवर्तनों को प्रतिबिंबित करने के लिए वेबसाइट कैश साफ़ करें</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          कैश किए गए डेटा को साफ़ करने और सामग्री के पुनः लोड करने के लिए इस विकल्प का उपयोग करें।
          वेबसाइट में महत्वपूर्ण परिवर्तन करने के बाद यह आवश्यक हो सकता है।
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              कैश साफ़ करने के बाद, अपने आगंतुकों को अपना ब्राउज़र रीफ्रेश करने या
              नवीनतम परिवर्तन देखने के लिए अपना ब्राउज़र कैश साफ़ करने का निर्देश दें।
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Copy className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-800 mb-2">
                उपयोगकर्ताओं को अपना कैश रीफ्रेश करने के लिए नीचे दिए गए लिंक को साझा करें।
                यह उन्हें नवीनतम संस्करण पर पुनर्निर्देशित करेगा।
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-xs"
                onClick={copyRefreshLink}
              >
                <Copy className="h-3 w-3 mr-1" /> कैश रीफ्रेश लिंक कॉपी करें
              </Button>
            </div>
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
              कैश साफ़ कर रहा है...
            </>
          ) : (
            'कैश साफ़ करें'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CacheManager;
