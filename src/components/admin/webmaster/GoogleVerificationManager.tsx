
import React, { useEffect } from 'react';
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
import { useGoogleVerification } from './hooks/useGoogleVerification';
import VerificationDialog from './google/VerificationDialog';
import HtmlTagDialog from './google/HtmlTagDialog';
import VerificationInfo from './google/VerificationInfo';
import { toast } from 'sonner';

const GoogleVerificationManager = () => {
  const {
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
    generateMetaTag,
    copyToClipboard,
    handleVerificationSave,
    showHtmlTag,
    downloadVerificationFile,
    removeVerification,
  } = useGoogleVerification();

  // Check if verification settings exist
  const hasVerification = !!localStorage.getItem('google-webmaster-settings');

  useEffect(() => {
    // Force re-render whenever dialog state changes
    console.log('Dialog state updated:', { isGoogleDialogOpen, isTagDialogOpen });
  }, [isGoogleDialogOpen, isTagDialogOpen]);

  const handleAddVerification = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Add Verification button clicked');
    setIsGoogleDialogOpen(true);
  };

  // Changed this function to not require an event parameter
  const handleShowHtmlTag = () => {
    console.log('Show HTML Tag button clicked directly from manager');
    showHtmlTag();
  };

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
          {hasVerification ? (
            <VerificationInfo 
              siteUrl={siteUrl}
              verificationMethod={verificationMethod}
              onShowHtmlTag={handleShowHtmlTag}
              onDownloadFile={downloadVerificationFile}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No Google verification configured yet.
              Click the button below to set up verification for your website.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <Button 
            onClick={handleAddVerification}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {hasVerification ? 'Update Verification' : 'Add Verification'}
          </Button>
          
          {hasVerification && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                removeVerification();
                toast.success('Verification removed successfully');
              }}
            >
              Remove Verification
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Dialogs */}
      <VerificationDialog 
        isOpen={isGoogleDialogOpen}
        onOpenChange={setIsGoogleDialogOpen}
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

export default GoogleVerificationManager;
