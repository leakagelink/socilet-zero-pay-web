
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Copy, Search } from 'lucide-react';

const GoogleVerificationManager = () => {
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('html');
  const [verificationCode, setVerificationCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Copied to clipboard!');
    }, () => {
      toast.error('Failed to copy!');
    });
  };

  const generateMetaTag = () => {
    return `<meta name="google-site-verification" content="${verificationCode}" />`;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    localStorage.setItem('google-webmaster-settings', JSON.stringify({
      url: siteUrl,
      method: verificationMethod,
      code: verificationCode,
    }));
    
    if (verificationMethod === 'html') {
      toast.success('Verification code saved. Please add the meta tag to your site\'s <head> section.');
      setTimeout(() => {
        setIsGoogleDialogOpen(false);
        setIsTagDialogOpen(true); // Automatically show the HTML tag after saving
      }, 1000);
    } else if (verificationMethod === 'html-file') {
      toast.success('HTML file verification selected. Please upload the file to your site root.');
      setIsGoogleDialogOpen(false);
    } else {
      toast.success('Verification settings saved.');
      setIsGoogleDialogOpen(false);
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
      // Create file content
      const fileContent = `google-site-verification: ${verificationCode}.html`;
      
      // Create a blob
      const blob = new Blob([fileContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create temp link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `${verificationCode}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Verification file downloaded');
    } else {
      toast.error('Please save HTML file verification settings first');
    }
  };

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('google-webmaster-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSiteUrl(settings.url || '');
        setVerificationMethod(settings.method || 'html');
        setVerificationCode(settings.code || '');
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  }, []);

  // Debug logs to check state changes
  console.log('Dialog state:', { isGoogleDialogOpen, isTagDialogOpen });

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} /> Google Search Console
          </CardTitle>
          <CardDescription>
            Verify your website ownership with Google Search Console
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {localStorage.getItem('google-webmaster-settings') ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base font-medium">
                <CheckCircle size={18} className="text-green-500" />
                <span>Verification in progress</span>
              </div>
              <p className="text-sm text-muted-foreground">Site: {siteUrl}</p>
              <p className="text-xs text-muted-foreground">Method: {verificationMethod === 'html' ? 'HTML Meta Tag' : 'HTML File Upload'}</p>
              {verificationMethod === 'html' && (
                <Button variant="outline" size="sm" onClick={showHtmlTag}>Show HTML Tag</Button>
              )}
              {verificationMethod === 'html-file' && (
                <Button variant="outline" size="sm" onClick={downloadVerificationFile}>Download Verification File</Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No Google verification configured yet.
              Click the button below to set up verification for your website.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button 
            onClick={() => {
              console.log('Add Verification button clicked');
              setIsGoogleDialogOpen(true);
            }} 
            className="bg-primary-600 hover:bg-primary-700"
          >
            {localStorage.getItem('google-webmaster-settings') ? 'Update Verification' : 'Add Verification'}
          </Button>
          {localStorage.getItem('google-webmaster-settings') && 
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('google-webmaster-settings');
                setSiteUrl('');
                setVerificationCode('');
                setVerificationMethod('html');
                toast.success('Google verification removed');
              }}
            >
              Remove Verification
            </Button>
          }
        </CardFooter>
      </Card>
      
      <Dialog open={isGoogleDialogOpen} onOpenChange={setIsGoogleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Google Search Console Verification</DialogTitle>
            <DialogDescription>
              Enter your website details and verification code from Google Search Console
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="site-url" className="text-right">
                  Site URL
                </Label>
                <Input
                  id="site-url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Select 
                  value={verificationMethod}
                  onValueChange={setVerificationMethod}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML Meta Tag</SelectItem>
                    <SelectItem value="html-file">HTML File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  {verificationMethod === 'html' 
                    ? 'Meta Content' 
                    : 'Filename'}
                </Label>
                <Input
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder={verificationMethod === 'html' 
                    ? "XYZ123abc..." 
                    : "googleXYZ123abc..."}
                  className="col-span-3"
                />
              </div>
              <div className="col-span-4 text-xs text-muted-foreground">
                <p>
                  {verificationMethod === 'html' 
                    ? 'Enter only the content value from the meta tag provided by Google.' 
                    : 'Enter the filename provided by Google (without .html extension).'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Verification</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>HTML Meta Tag</DialogTitle>
            <DialogDescription>
              Add this meta tag to the &lt;head&gt; section of your website's HTML
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="meta-tag">HTML Tag</Label>
              <div className="relative">
                <Input
                  id="meta-tag"
                  readOnly
                  value={generateMetaTag()}
                  className="pr-12 font-mono text-xs"
                />
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => copyToClipboard(generateMetaTag())}
                >
                  {copySuccess ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md text-xs">
            <p>
              1. Copy the above meta tag<br />
              2. Paste it in the &lt;head&gt; section of your website's HTML<br />
              3. Return to Google Search Console and click "Verify"
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTagDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleVerificationManager;
