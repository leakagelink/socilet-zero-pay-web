
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Code, FileDown } from 'lucide-react';

interface VerificationInfoProps {
  siteUrl: string;
  verificationMethod: 'html' | 'html-file';
  onShowHtmlTag: () => void;
  onDownloadFile: () => void;
}

const BingVerificationInfo: React.FC<VerificationInfoProps> = ({
  siteUrl,
  verificationMethod,
  onShowHtmlTag,
  onDownloadFile
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <span className="font-medium">Site URL:</span> {siteUrl}
        </AlertDescription>
      </Alert>
      
      <Alert>
        <AlertDescription>
          <span className="font-medium">Verification Method:</span> {
            verificationMethod === 'html' 
              ? 'HTML Meta Tag'
              : 'HTML File Upload'
          }
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {verificationMethod === 'html' ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShowHtmlTag}
            className="flex items-center gap-1"
          >
            <Code size={14} />
            View HTML Meta Tag
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDownloadFile}
            className="flex items-center gap-1"
          >
            <FileDown size={14} />
            Download BingSiteAuth.xml
          </Button>
        )}
      </div>
    </div>
  );
};

export default BingVerificationInfo;
