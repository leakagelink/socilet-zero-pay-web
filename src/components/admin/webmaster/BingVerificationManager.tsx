
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
import { useBingVerification } from './hooks/useBingVerification';
import BingVerificationDialogs from './bing/BingVerificationDialogs';
import BingVerificationInfo from './bing/BingVerificationInfo';

const BingVerificationManager = () => {
  const {
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
  } = useBingVerification();

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
            <BingVerificationInfo 
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
      
      <BingVerificationDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isTagDialogOpen={isTagDialogOpen}
        setIsTagDialogOpen={setIsTagDialogOpen}
        siteUrl={siteUrl}
        setSiteUrl={setSiteUrl}
        verificationMethod={verificationMethod}
        setVerificationMethod={setVerificationMethod}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        copySuccess={copySuccess}
        onSubmit={handleVerificationSave}
        onCopy={copyToClipboard}
        metaTag={generateMetaTag()}
      />
    </>
  );
};

export default BingVerificationManager;
