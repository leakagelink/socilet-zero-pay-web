
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import VerificationDialog from './google/VerificationDialog'; // Reuse verification dialog
import HtmlTagDialog from './google/HtmlTagDialog'; // Reuse HTML tag dialog
import VerificationInfo from './google/VerificationInfo'; // Reuse verification info component

interface BingVerificationSettings {
  url: string;
  method: 'html' | 'html-file';
  code: string;
  isVerified?: boolean;
}

const BingVerificationManager = () => {
  // Default Bing verification code to the one provided
  const defaultVerificationCode = 'F369CBC92F03EBB72A41A8782CB42881';
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'html' | 'html-file'>('html');
  const [verificationCode, setVerificationCode] = useState(defaultVerificationCode);
  const [copySuccess, setCopySuccess] = useState(false);

  // Check if verification settings exist
  const hasVerification = !!localStorage.getItem('bing-webmaster-settings');

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('bing-webmaster-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as BingVerificationSettings;
        setSiteUrl(settings.url || '');
        setVerificationMethod(settings.method || 'html');
        setVerificationCode(settings.code || defaultVerificationCode);
      } else {
        // If no settings exist, pre-populate with the default verification code
        setVerificationCode(defaultVerificationCode);
      }
    } catch (error) {
      console.error('Error loading saved Bing settings:', error);
      // If there was an error, still set the default verification code
      setVerificationCode(defaultVerificationCode);
    }
  }, []);

  const generateMetaTag = () => {
    return `<meta name="msvalidate.01" content="${verificationCode}" />`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Copied to clipboard!');
    }, () => {
      toast.error('Failed to copy!');
    });
  };

  const handleVerificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteUrl) {
      toast.error('Please enter a site URL');
      return;
    }

    if (!verificationCode) {
      toast.error('Please enter a verification code');
      return;
    }

    // Save to localStorage
    localStorage.setItem('bing-webmaster-settings', JSON.stringify({
      url: siteUrl,
      method: verificationMethod,
      code: verificationCode,
    }));
    
    // Close verification dialog
    setIsDialogOpen(false);
    
    if (verificationMethod === 'html') {
      toast.success('Bing verification code saved. Please add the meta tag to your site\'s <head> section.');
      // Give a slight delay before showing the HTML tag dialog
      setTimeout(() => {
        setIsTagDialogOpen(true);
      }, 200);
    } else if (verificationMethod === 'html-file') {
      toast.success('HTML file verification selected. Please upload the file to your site root.');
      setTimeout(() => {
        downloadVerificationFile();
      }, 200);
    }
  };

  const showHtmlTag = () => {
    if (verificationMethod === 'html' && verificationCode) {
      setIsTagDialogOpen(true);
    } else {
      toast.error('Please save HTML verification settings first');
    }
  };

  const downloadVerificationFile = () => {
    if (verificationMethod === 'html-file' && verificationCode) {
      // Create file content for Bing verification
      const fileContent = `<?xml version="1.0"?>
<users>
  <user>${verificationCode}</user>
</users>`;
      
      // Create a blob
      const blob = new Blob([fileContent], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      
      // Create temp link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BingSiteAuth.xml';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Bing verification file downloaded');
    } else {
      toast.error('Please save HTML file verification settings first');
    }
  };

  const removeVerification = () => {
    localStorage.removeItem('bing-webmaster-settings');
    setSiteUrl('');
    setVerificationCode('');
    setVerificationMethod('html');
    toast.success('Bing verification removed successfully');
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} /> Bing Webmaster Tools
          </CardTitle>
          <CardDescription>
            Verify your website ownership with Bing Webmaster Tools
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {hasVerification ? (
            <VerificationInfo 
              siteUrl={siteUrl}
              verificationMethod={verificationMethod}
              onShowHtmlTag={showHtmlTag}
              onDownloadFile={downloadVerificationFile}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No Bing verification configured yet.
              Click the button below to set up verification for your website.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button onClick={() => setIsDialogOpen(true)}>
            {hasVerification ? 'Update Bing Verification' : 'Add Bing Verification'}
          </Button>
          
          {hasVerification && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={removeVerification}
            >
              Remove Verification
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <VerificationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        siteUrl={siteUrl}
        setSiteUrl={setSiteUrl}
        verificationMethod={verificationMethod}
        setVerificationMethod={setVerificationMethod}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onSubmit={handleVerificationSave}
      />
      
      <HtmlTagDialog 
        isOpen={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        metaTag={generateMetaTag()}
        onCopy={copyToClipboard}
        copySuccess={copySuccess}
      />
    </>
  );
};

export default BingVerificationManager;
