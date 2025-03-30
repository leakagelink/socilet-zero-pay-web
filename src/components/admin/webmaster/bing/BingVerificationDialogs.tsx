
import React from 'react';
import VerificationDialog from '../google/VerificationDialog'; // Reuse the Google verification dialog
import HtmlTagDialog from '../google/HtmlTagDialog'; // Reuse the Google HTML tag dialog

interface BingVerificationDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isTagDialogOpen: boolean;
  setIsTagDialogOpen: (open: boolean) => void;
  siteUrl: string;
  setSiteUrl: (url: string) => void;
  verificationMethod: 'html' | 'html-file';
  setVerificationMethod: (method: 'html' | 'html-file') => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  copySuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCopy: (text: string) => void;
  metaTag: string;
}

const BingVerificationDialogs: React.FC<BingVerificationDialogsProps> = ({
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
  onSubmit,
  onCopy,
  metaTag
}) => {
  return (
    <>
      <VerificationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        siteUrl={siteUrl}
        setSiteUrl={setSiteUrl}
        verificationMethod={verificationMethod}
        setVerificationMethod={setVerificationMethod}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onSubmit={onSubmit}
      />
      
      <HtmlTagDialog 
        isOpen={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        metaTag={metaTag}
        onCopy={onCopy}
        copySuccess={copySuccess}
      />
    </>
  );
};

export default BingVerificationDialogs;
