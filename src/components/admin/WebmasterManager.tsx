
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Globe, FileText, Plus, Trash, BingLogo } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Bing logo icon since it's not in Lucide
const BingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
    <path d="M5.06 3L5 6.75l4.94 1.69v4.87L3.5 10.5v7.13L10 21l9.5-5.25v-6l-9.5 3.25V9.13l5-1.69V3h-9.94z" />
  </svg>
);

// Custom Yandex logo icon since it's not in Lucide
const YandexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
    <path d="M2 11.583h2.981v5.834h2.003v-5.834h2.981v-1.75H2v1.75zm17.257 4.063l-3.023-5.834h-2.796v7.583h1.935v-4.195l2.889 4.195h2.034v-7.583h-1.94v5.834h-.099z"/>
    <path d="M21.268 3.328h-4.899l-3.095 5.139v5.116h2.132v-5.116l1.336-2.267h2.777c1.007 0 1.683.797 1.683 1.697v5.686h2.132V7.474c0-2.267-1.883-4.146-4.066-4.146z"/>
  </svg>
);

const WebmasterManager = () => {
  const [googleVerificationId, setGoogleVerificationId] = useState('');
  const [bingVerificationId, setBingVerificationId] = useState('');
  const [yandexVerificationId, setYandexVerificationId] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentEngine, setCurrentEngine] = useState('google');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  
  const handleSaveVerification = (engine: string) => {
    let verificationId = '';
    let storageKey = '';
    
    switch(engine) {
      case 'google':
        verificationId = googleVerificationId;
        storageKey = 'gsc-verification-id';
        break;
      case 'bing':
        verificationId = bingVerificationId;
        storageKey = 'bing-verification-id';
        break;
      case 'yandex':
        verificationId = yandexVerificationId;
        storageKey = 'yandex-verification-id';
        break;
      default:
        return;
    }
    
    if (!verificationId.trim()) {
      toast.error(`Please enter a valid ${engine} verification ID`);
      return;
    }
    
    localStorage.setItem(storageKey, verificationId);
    toast.success(`${engine.charAt(0).toUpperCase() + engine.slice(1)} verification ID saved successfully`);
    
    // In a real implementation, this would be saved to a database
    let metaTag = '';
    switch(engine) {
      case 'google':
        metaTag = `<meta name="google-site-verification" content="${verificationId}" />`;
        break;
      case 'bing':
        metaTag = `<meta name="msvalidate.01" content="${verificationId}" />`;
        break;
      case 'yandex':
        metaTag = `<meta name="yandex-verification" content="${verificationId}" />`;
        break;
    }
    
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
    localStorage.setItem('webmaster-sitemaps', JSON.stringify(updatedSitemaps));
    toast.success('Sitemap added successfully');
  };
  
  const handleRemoveSitemap = (index: number) => {
    const updatedSitemaps = sitemaps.filter((_, i) => i !== index);
    setSitemaps(updatedSitemaps);
    localStorage.setItem('webmaster-sitemaps', JSON.stringify(updatedSitemaps));
    toast.success('Sitemap removed');
  };
  
  const showInstructionsDialog = (engine: string) => {
    setCurrentEngine(engine);
    setShowInstructions(true);
  };
  
  React.useEffect(() => {
    // Load saved data from localStorage
    const savedGoogleVerificationId = localStorage.getItem('gsc-verification-id');
    if (savedGoogleVerificationId) {
      setGoogleVerificationId(savedGoogleVerificationId);
    }
    
    const savedBingVerificationId = localStorage.getItem('bing-verification-id');
    if (savedBingVerificationId) {
      setBingVerificationId(savedBingVerificationId);
    }
    
    const savedYandexVerificationId = localStorage.getItem('yandex-verification-id');
    if (savedYandexVerificationId) {
      setYandexVerificationId(savedYandexVerificationId);
    }
    
    const savedSitemaps = localStorage.getItem('webmaster-sitemaps');
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
        <h2 className="text-2xl font-bold mb-4">Search Engine Webmaster Tools</h2>
        <p className="text-gray-600 mb-6">
          Connect your website with search engine webmaster tools to monitor your site's presence in search results.
        </p>
      </div>
      
      <Tabs defaultValue="google" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="google" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" /> Google
          </TabsTrigger>
          <TabsTrigger value="bing" className="flex items-center">
            <BingIcon /> Bing
          </TabsTrigger>
          <TabsTrigger value="yandex" className="flex items-center">
            <YandexIcon /> Yandex
          </TabsTrigger>
          <TabsTrigger value="sitemaps" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Sitemaps
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Google Search Console Verification
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="google-verification-id">Google Verification ID</Label>
              <div className="flex mt-1">
                <Input
                  id="google-verification-id"
                  placeholder="Enter your Google verification ID"
                  value={googleVerificationId}
                  onChange={(e) => setGoogleVerificationId(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={() => handleSaveVerification('google')}
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
              onClick={() => showInstructionsDialog('google')}
            >
              How to get verification ID
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="bing" className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <BingIcon />
            Bing Webmaster Tools Verification
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bing-verification-id">Bing Verification ID</Label>
              <div className="flex mt-1">
                <Input
                  id="bing-verification-id"
                  placeholder="Enter your Bing verification ID"
                  value={bingVerificationId}
                  onChange={(e) => setBingVerificationId(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={() => handleSaveVerification('bing')}
                  className="ml-2"
                >
                  Save
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                The verification ID is the content of the meta tag provided by Bing Webmaster Tools.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => showInstructionsDialog('bing')}
            >
              How to get verification ID
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="yandex" className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <YandexIcon />
            Yandex Webmaster Verification
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="yandex-verification-id">Yandex Verification ID</Label>
              <div className="flex mt-1">
                <Input
                  id="yandex-verification-id"
                  placeholder="Enter your Yandex verification ID"
                  value={yandexVerificationId}
                  onChange={(e) => setYandexVerificationId(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={() => handleSaveVerification('yandex')}
                  className="ml-2"
                >
                  Save
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                The verification ID is the content of the meta tag provided by Yandex Webmaster.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => showInstructionsDialog('yandex')}
            >
              How to get verification ID
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="sitemaps" className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
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
        </TabsContent>
      </Tabs>
      
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEngine === 'google' && "How to Find Your Google Verification ID"}
              {currentEngine === 'bing' && "How to Find Your Bing Verification ID"}
              {currentEngine === 'yandex' && "How to Find Your Yandex Verification ID"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {currentEngine === 'google' && (
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
            )}
            
            {currentEngine === 'bing' && (
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bing Webmaster Tools</a></li>
                <li>Sign in and add your website</li>
                <li>Choose the "Meta Tag" verification option</li>
                <li>Bing will provide a meta tag that looks like:<br />
                  <code className="bg-gray-100 p-1 rounded text-sm">
                    &lt;meta name="msvalidate.01" content="XXXXXXXXXXXX" /&gt;
                  </code>
                </li>
                <li>Copy only the content value (XXXXXXXXXXXX) and paste it in the verification field</li>
              </ol>
            )}
            
            {currentEngine === 'yandex' && (
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <a href="https://webmaster.yandex.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Yandex Webmaster</a></li>
                <li>Add your website</li>
                <li>Select "Meta tag" verification method</li>
                <li>Yandex will provide a meta tag that looks like:<br />
                  <code className="bg-gray-100 p-1 rounded text-sm">
                    &lt;meta name="yandex-verification" content="XXXXXXXXXXXX" /&gt;
                  </code>
                </li>
                <li>Copy only the content value (XXXXXXXXXXXX) and paste it in the verification field</li>
              </ol>
            )}
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
