
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Globe, FileText, Plus, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const WebmasterManager = () => {
  const [verificationId, setVerificationId] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  
  const handleSaveVerification = () => {
    if (!verificationId.trim()) {
      toast.error('Please enter a valid verification ID');
      return;
    }
    
    localStorage.setItem('gsc-verification-id', verificationId);
    toast.success('Verification ID saved successfully');
    
    // In a real implementation, this would be saved to a database
    const metaTag = `<meta name="google-site-verification" content="${verificationId}" />`;
    toast.info(`Add this to your site's head: ${metaTag}`);
  };
  
  const handleAddSitemap = () => {
    if (!sitemapUrl.trim() || !sitemapUrl.endsWith('.xml')) {
      toast.error('Please enter a valid sitemap URL ending with .xml');
      return;
    }
    
    const updatedSitemaps = [...sitemaps, sitemapUrl];
    setSitemaps(updatedSitemaps);
    setSitemapUrl('');
    localStorage.setItem('gsc-sitemaps', JSON.stringify(updatedSitemaps));
    toast.success('Sitemap added successfully');
  };
  
  const handleRemoveSitemap = (index: number) => {
    const updatedSitemaps = sitemaps.filter((_, i) => i !== index);
    setSitemaps(updatedSitemaps);
    localStorage.setItem('gsc-sitemaps', JSON.stringify(updatedSitemaps));
    toast.success('Sitemap removed');
  };
  
  React.useEffect(() => {
    // Load saved data from localStorage
    const savedVerificationId = localStorage.getItem('gsc-verification-id');
    if (savedVerificationId) {
      setVerificationId(savedVerificationId);
    }
    
    const savedSitemaps = localStorage.getItem('gsc-sitemaps');
    if (savedSitemaps) {
      try {
        setSitemaps(JSON.parse(savedSitemaps));
      } catch (e) {
        console.error('Failed to parse saved sitemaps', e);
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Google Search Console Integration</h2>
        <p className="text-gray-600 mb-6">
          Connect your website with Google Search Console to monitor your site's presence in Google search results.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Globe className="mr-2 h-5 w-5 text-primary" />
          Site Verification
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="verification-id">Google Verification ID</Label>
            <div className="flex mt-1">
              <Input
                id="verification-id"
                placeholder="Enter your Google verification ID"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleSaveVerification}
                className="ml-2"
              >
                Save
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              The verification ID is the content of the meta tag provided by Google Search Console.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowInstructions(true)}
          >
            How to get verification ID
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Sitemap Management
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sitemap-url">Sitemap URL</Label>
            <div className="flex mt-1">
              <Input
                id="sitemap-url"
                placeholder="https://yourdomain.com/sitemap.xml"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleAddSitemap}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Current Sitemaps</h4>
            {sitemaps.length === 0 ? (
              <p className="text-sm text-gray-500">No sitemaps added yet</p>
            ) : (
              <ul className="space-y-2">
                {sitemaps.map((sitemap, index) => (
                  <li key={index} className="flex items-center justify-between border p-2 rounded">
                    <span className="text-sm truncate mr-2 flex-grow">{sitemap}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveSitemap(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to Find Your Verification ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Search Console</a></li>
              <li>Add your property (website)</li>
              <li>Select "HTML tag" verification method</li>
              <li>Google will provide a meta tag that looks like:<br />
                <code className="bg-gray-100 p-1 rounded text-sm">
                  &lt;meta name="google-site-verification" content="XXXXXXXXXXXX" /&gt;
                </code>
              </li>
              <li>Copy only the content value (XXXXXXXXXXXX) and paste it in the verification field</li>
            </ol>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebmasterManager;
