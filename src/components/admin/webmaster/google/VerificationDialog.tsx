
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VerificationForm from './VerificationForm';

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  siteUrl: string;
  setSiteUrl: (url: string) => void;
  verificationMethod: 'html' | 'html-file';
  setVerificationMethod: (method: 'html' | 'html-file') => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const VerificationDialog = ({
  isOpen,
  onOpenChange,
  siteUrl,
  setSiteUrl,
  verificationMethod,
  setVerificationMethod,
  verificationCode,
  setVerificationCode,
  onSubmit
}: VerificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Search Console Verification</DialogTitle>
          <DialogDescription>
            Enter your website details and verification code from Google Search Console
          </DialogDescription>
        </DialogHeader>
        <VerificationForm 
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
          verificationMethod={verificationMethod}
          setVerificationMethod={setVerificationMethod}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
