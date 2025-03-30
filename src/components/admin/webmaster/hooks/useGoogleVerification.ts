
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface GoogleVerificationSettings {
  url: string;
  method: 'html' | 'html-file';
  code: string;
  isVerified?: boolean;
}

export const useGoogleVerification = () => {
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'html' | 'html-file'>('html');
  const [verificationCode, setVerificationCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('google-webmaster-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as GoogleVerificationSettings;
        setSiteUrl(settings.url || '');
        setVerificationMethod(settings.method || 'html');
        setVerificationCode(settings.code || '');
        setIsVerified(settings.isVerified || false);
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
    console.log('Saving verification settings:', { siteUrl, verificationMethod, verificationCode });
    
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
      isVerified: false // Default to not verified
    }));
    
    // Close verification dialog
    setIsGoogleDialogOpen(false);
    
    if (verificationMethod === 'html') {
      toast.success('Verification code saved. Please add the meta tag to your site\'s <head> section.');
      // Give a slight delay before showing the HTML tag dialog
      setTimeout(() => {
        setIsTagDialogOpen(true);
        console.log('Tag dialog opened:', true);
      }, 200);
    } else if (verificationMethod === 'html-file') {
      toast.success('HTML file verification selected. Please upload the file to your site root.');
      setTimeout(() => {
        downloadVerificationFile();
      }, 200);
    } else {
      toast.success('Verification settings saved.');
    }
  };

  const showHtmlTag = () => {
    console.log('showHtmlTag called, method:', verificationMethod, 'code:', verificationCode);
    if (verificationMethod === 'html' && verificationCode) {
      setIsTagDialogOpen(true);
      console.log('Setting tag dialog to open');
    } else {
      toast.error('Please save HTML verification settings first');
    }
  };

  const downloadVerificationFile = () => {
    console.log('downloadVerificationFile called');
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
    setIsVerified(false);
    console.log('Verification removed');
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
    isVerified,
    setIsVerified,
    generateMetaTag,
    copyToClipboard,
    handleVerificationSave,
    showHtmlTag,
    downloadVerificationFile,
    removeVerification,
  };
};
