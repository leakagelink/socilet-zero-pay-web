
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface VerificationInfoProps {
  siteUrl: string;
  verificationMethod: 'html' | 'html-file';
  onShowHtmlTag: () => void;
  onDownloadFile: () => void;
}

const VerificationInfo = ({
  siteUrl,
  verificationMethod,
  onShowHtmlTag,
  onDownloadFile
}: VerificationInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-base font-medium">
        <CheckCircle size={18} className="text-green-500" />
        <span>Verification in progress</span>
      </div>
      <p className="text-sm text-muted-foreground">Site: {siteUrl}</p>
      <p className="text-xs text-muted-foreground">
        Method: {verificationMethod === 'html' ? 'HTML Meta Tag' : 'HTML File Upload'}
      </p>
      
      {verificationMethod === 'html' && (
        <Button variant="outline" size="sm" onClick={onShowHtmlTag}>Show HTML Tag</Button>
      )}
      
      {verificationMethod === 'html-file' && (
        <Button variant="outline" size="sm" onClick={onDownloadFile}>Download Verification File</Button>
      )}
    </div>
  );
};

export default VerificationInfo;
