import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, Key, Search, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WebmasterManager = () => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Google Search Console states
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('html');
  const [verificationCode, setVerificationCode] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const tagRef = useRef<HTMLTextAreaElement>(null);

  const handleClearCache = () => {
    // Simulate clearing cache
    setTimeout(() => {
      toast.success('Cache cleared successfully');
    }, 1000);
  };

  const handleChangePassword = () => {
    // Validate current password
    if (currentPassword !== localStorage.getItem('admin-password')) {
      toast.error('Current password is incorrect');
      return;
    }

    // Validate new password
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Update password in localStorage
    localStorage.setItem('admin-password', newPassword);
    
    // Close dialog and reset forms
    setIsPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast.success('Password updated successfully');
  };

  const handleSaveGoogleVerification = () => {
    // Validate inputs
    if (!siteUrl) {
      toast.error('Please enter your site URL');
      return;
    }
    
    if (!verificationCode) {
      toast.error('Please enter your verification code');
      return;
    }

    // Save the verification settings to localStorage
    const googleSettings = {
      url: siteUrl,
      method: verificationMethod,
      code: verificationCode,
      date: new Date().toISOString()
    };
    
    localStorage.setItem('google-webmaster-settings', JSON.stringify(googleSettings));
    
    if (verificationMethod === 'html') {
      toast.success('Verification code saved. Please add the meta tag to your site\'s <head> section.');
    } else if (verificationMethod === 'html-file') {
      toast.success('HTML file verification selected. Please upload the file to your site root.');
    } else {
      toast.success('Verification settings saved.');
    }
    
    setIsGoogleDialogOpen(false);
  };

  const showHtmlTag = () => {
    if (verificationMethod === 'html' && verificationCode) {
      setIsTagDialogOpen(true);
    } else {
      toast.error('Please enter a valid verification code first');
    }
  };

  const copyToClipboard = () => {
    if (tagRef.current) {
      tagRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Meta tag copied to clipboard');
    }
  };

  const extractMetaContent = (metaTag: string) => {
    const contentMatch = metaTag.match(/content="([^"]+)"/);
    return contentMatch ? contentMatch[1] : '';
  };

  const getFormattedMetaTag = () => {
    if (verificationCode.includes('<meta') && verificationCode.includes('google-site-verification')) {
      return verificationCode.trim();
    }
    
    return `<meta name="google-site-verification" content="${extractMetaContent(verificationCode) || verificationCode}" />`;
  };

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('google-webmaster-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSiteUrl(settings.url || '');
      setVerificationMethod(settings.method || 'html');
      setVerificationCode(settings.code || '');
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Webmaster Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Search Console Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Google Search Console
            </CardTitle>
            <CardDescription>Verify and manage your site with Google Search Console</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Verify your site ownership and monitor its presence in Google Search results.
            </p>
            {localStorage.getItem('google-webmaster-settings') && (
              <div className="bg-gray-50 p-3 rounded-md border text-sm mb-4">
                <p className="font-medium">Site Verification Status:</p>
                <p className="text-green-600">✓ Verification settings saved</p>
                <p className="text-xs text-gray-500 mt-1">
                  {JSON.parse(localStorage.getItem('google-webmaster-settings') || '{}').method === 'html' 
                    ? 'Meta tag method' 
                    : 'HTML file method'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <Button onClick={() => setIsGoogleDialogOpen(true)}>
              {localStorage.getItem('google-webmaster-settings') ? 'Update Verification' : 'Add Verification'}
            </Button>
            {localStorage.getItem('google-webmaster-settings') && 
              JSON.parse(localStorage.getItem('google-webmaster-settings') || '{}').method === 'html' && (
                <Button variant="outline" onClick={showHtmlTag} className="mt-2">
                  View HTML Meta Tag
                </Button>
              )
            }
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-600 hover:underline"
            >
              Open Google Search Console →
            </a>
          </CardFooter>
        </Card>
        
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Admin Password
            </CardTitle>
            <CardDescription>Change your admin panel access password</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              For security, change your password regularly. Your password should be 
              at least 6 characters and include a mix of letters and numbers.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsPasswordDialogOpen(true)}>Change Password</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Other Settings
            </CardTitle>
            <CardDescription>Additional webmaster settings and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Advanced settings for website maintenance and optimization.
              (More features coming soon)
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>Manage Settings</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Update your admin password below. Make sure to use a strong, secure password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Google Search Console Dialog */}
      <Dialog open={isGoogleDialogOpen} onOpenChange={setIsGoogleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Google Search Console Verification</DialogTitle>
            <DialogDescription>
              Connect your website to Google Search Console for search visibility monitoring and optimization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="site-url" className="text-right">
                Website URL
              </Label>
              <Input
                id="site-url"
                type="text"
                placeholder="https://example.com"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verification-method" className="text-right">
                Verification Method
              </Label>
              <div className="col-span-3">
                <select 
                  id="verification-method" 
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                >
                  <option value="html">HTML meta tag</option>
                  <option value="html-file">HTML file upload</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="verification-code" className="text-right pt-2">
                Verification Code
              </Label>
              <div className="col-span-3 space-y-2">
                <Textarea
                  id="verification-code"
                  placeholder={verificationMethod === 'html' ? 
                    '<meta name="google-site-verification" content="your-code-here" />' : 
                    'Paste the content of your verification HTML file here'
                  }
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  {verificationMethod === 'html' ? 
                    'Paste the entire meta tag from Google Search Console or just the verification code.' : 
                    'Paste the content of the HTML verification file provided by Google.'
                  }
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoogleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoogleVerification}>
              Save Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HTML Meta Tag Dialog */}
      <AlertDialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>HTML Verification Meta Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Add this meta tag to your website's &lt;head&gt; section to verify ownership.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-3 bg-gray-50 border rounded-md">
            <Textarea
              ref={tagRef}
              readOnly
              className="font-mono text-sm bg-transparent border-0 p-0 focus-visible:ring-0"
              value={getFormattedMetaTag()}
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <Button onClick={copyToClipboard} className="gap-2">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WebmasterManager;
