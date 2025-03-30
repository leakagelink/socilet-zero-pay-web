
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const CacheManager = () => {
  const handleClearCache = () => {
    // Simulate clearing cache
    setTimeout(() => {
      toast.success('Cache cleared successfully');
    }, 1000);
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
        <p className="text-sm text-gray-500">
          Use this option to clear cached data and force reload of content.
          This may be necessary after making significant changes to the website.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClearCache}>Clear Cache</Button>
      </CardFooter>
    </Card>
  );
};

export default CacheManager;
