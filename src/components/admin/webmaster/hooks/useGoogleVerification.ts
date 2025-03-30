
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface GoogleVerificationSettings {
  url: string;
  method: 'html' | 'html-file';
  code: string;
}

export const useGoogleVerification = () => {
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'html' | 'html-file'>('html');
  const [verificationCode, setVerificationCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('google-webmaster-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as GoogleVerificationSettings;
        setSiteUrl(settings.url || '');
        setVerificationMethod(settings.method || 'html');
        setVerificationCode(settings.code || '');
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  }, []);

  const generateMetaTag = () => {
    return `<meta name="google-site-verification" content="${verificationCode}" />`;
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

  const removeVerification = () => {
    localStorage.removeItem('google-webmaster-settings');
    setSiteUrl('');
    setVerificationCode('');
    setVerificationMethod('html');
    toast.success('Google verification removed');
  };

  return {
    isGoogleDialogOpen,
    setIsGoogleDialogOpen,
    isTagDialogOpen,
    setIsTagDialogOpen,
    siteUrl,
    setSiteUrl,
    verificationMethod,
    setVerificationMethod,
    verificationCode,
    setVerificationCode,
    copySuccess,
    setCopySuccess,
    generateMetaTag,
    copyToClipboard,
    handleVerificationSave,
    showHtmlTag,
    downloadVerificationFile,
    removeVerification,
  };
};
