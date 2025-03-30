
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationInfoProps {
  siteUrl: string;
  verificationMethod: 'html' | 'html-file';
  isVerified?: boolean;
  onShowHtmlTag: () => void;  // Changed to not require a parameter
  onDownloadFile: () => void;
}

const VerificationInfo = ({
  siteUrl,
  verificationMethod,
  isVerified = false,
  onShowHtmlTag,
  onDownloadFile
}: VerificationInfoProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-base font-medium">
        {isVerified ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <AlertCircle size={18} className="text-amber-500" />
        )}
        <span>{isVerified ? "Verified" : "Verification in progress"}</span>
      </div>
      
      {siteUrl && <p className="text-sm text-muted-foreground">Site: {siteUrl}</p>}
      
      <p className="text-xs text-muted-foreground">
        Method: {verificationMethod === 'html' ? 'HTML Meta Tag' : 'HTML File Upload'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        {verificationMethod === 'html' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log("Show HTML Tag button clicked");
              onShowHtmlTag();
            }} 
            className="w-full sm:w-auto"
          >
            Show HTML Tag
          </Button>
        )}
        
        {verificationMethod === 'html-file' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log("Download file button clicked");
              onDownloadFile();
            }} 
            className="w-full sm:w-auto"
          >
            Download Verification File
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerificationInfo;
