
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

interface YandexVerificationSettings {
  url: string;
  method: 'html' | 'html-file';
  code: string;
  isVerified?: boolean;
}

const YandexVerificationManager = () => {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'html' | 'html-file'>('html');
  const [verificationCode, setVerificationCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Check if verification settings exist
  const hasVerification = !!localStorage.getItem('yandex-webmaster-settings');

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('yandex-webmaster-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as YandexVerificationSettings;
        setSiteUrl(settings.url || '');
        setVerificationMethod(settings.method || 'html');
        setVerificationCode(settings.code || '');
      }
      
      // Check if we have the new verification file in place
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '') {
        // Auto-set verification code if yandex file exists
        const yandexCode = 'afa21b00e0e57344';
        if (yandexCode && (!verificationCode || verificationCode !== yandexCode)) {
          setVerificationCode(yandexCode);
          setVerificationMethod('html-file');
        }
      }
    } catch (error) {
      console.error('Error loading saved Yandex settings:', error);
    }
  }, []);

  const generateMetaTag = () => {
    return `<meta name="yandex-verification" content="${verificationCode}" />`;
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
    localStorage.setItem('yandex-webmaster-settings', JSON.stringify({
      url: siteUrl,
      method: verificationMethod,
      code: verificationCode,
    }));
    
    // Close verification dialog
    setIsDialogOpen(false);
    
    if (verificationMethod === 'html') {
      toast.success('Yandex verification code saved. Please add the meta tag to your site\'s <head> section.');
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
      // Create file content for Yandex verification
      const fileContent = `<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body>Verification: ${verificationCode}</body>
</html>`;
      
      // Create a blob
      const blob = new Blob([fileContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create temp link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `yandex_${verificationCode}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Yandex verification file downloaded');
      
      // Auto save settings if not already saved
      if (!localStorage.getItem('yandex-webmaster-settings')) {
        localStorage.setItem('yandex-webmaster-settings', JSON.stringify({
          url: window.location.origin || siteUrl,
          method: 'html-file',
          code: verificationCode,
        }));
        toast.success('Yandex verification settings saved automatically');
      }
    } else {
      toast.error('Please save HTML file verification settings first');
    }
  };

  const removeVerification = () => {
    localStorage.removeItem('yandex-webmaster-settings');
    setSiteUrl('');
    setVerificationCode('');
    setVerificationMethod('html');
    toast.success('Yandex verification removed successfully');
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} /> Yandex Webmaster
          </CardTitle>
          <CardDescription>
            Verify your website ownership with Yandex Webmaster tools
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
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No Yandex verification configured yet.
                Click the button below to set up verification for your website.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">Verification File Present</h3>
                <p className="text-xs text-green-700">
                  A Yandex verification file has been automatically created at:<br />
                  <code className="bg-green-100 px-1 py-0.5 rounded text-green-900">
                    /yandex_afa21b00e0e57344.html
                  </code>
                </p>
                <p className="text-xs text-green-700 mt-2">
                  You can use this for HTML file verification in Yandex Webmaster Tools.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button onClick={() => setIsDialogOpen(true)}>
            {hasVerification ? 'Update Yandex Verification' : 'Add Yandex Verification'}
          </Button>
          
          {!hasVerification && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Auto configure with file verification
                localStorage.setItem('yandex-webmaster-settings', JSON.stringify({
                  url: window.location.origin || siteUrl,
                  method: 'html-file',
                  code: 'afa21b00e0e57344',
                }));
                setSiteUrl(window.location.origin);
                setVerificationMethod('html-file');
                setVerificationCode('afa21b00e0e57344');
                toast.success('Yandex verification configured with HTML file method');
              }}
              className="mt-2"
            >
              Quick Setup with File Verification
            </Button>
          )}
          
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

export default YandexVerificationManager;
