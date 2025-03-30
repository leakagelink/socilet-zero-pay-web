
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types
export interface BingVerificationSettings {
  url: string;
  method: 'html' | 'html-file';
  code: string;
  isVerified?: boolean;
}

export const useBingVerification = () => {
  // Default Bing verification code
  const defaultVerificationCode = 'F369CBC92F03EBB72A41A8782CB42881';
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'html' | 'html-file'>('html');
  const [verificationCode, setVerificationCode] = useState(defaultVerificationCode);
  const [copySuccess, setCopySuccess] = useState(false);

  // Computed value
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

  // Functions
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
    setVerificationCode(defaultVerificationCode);
    setVerificationMethod('html');
    toast.success('Bing verification removed successfully');
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isTagDialogOpen,
    setIsTagDialogOpen,
    siteUrl,
    setSiteUrl,
    verificationMethod,
    setVerificationMethod,
    verificationCode,
    setVerificationCode,
    copySuccess,
    hasVerification,
    generateMetaTag,
    copyToClipboard,
    handleVerificationSave,
    showHtmlTag,
    downloadVerificationFile,
    removeVerification,
  };
};
