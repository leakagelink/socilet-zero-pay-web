
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Code, FileDown, ExternalLink } from 'lucide-react';

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

      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertDescription className="flex flex-col gap-2">
          <div><span className="font-medium">Important:</span> Make sure the verification meta tag is placed in the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your HTML, before the <code className="bg-blue-100 px-1 rounded">&lt;body&gt;</code> tag.</div>
          <div className="text-xs text-blue-600">If you're using our hosted service, this tag should be automatically injected.</div>
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {verificationMethod === 'html' ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onShowHtmlTag}
              className="flex items-center gap-1"
            >
              <Code size={14} />
              View HTML Meta Tag
            </Button>
            <a 
              href="https://www.bing.com/webmasters/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <ExternalLink size={14} />
                Bing Webmaster Tools
              </Button>
            </a>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDownloadFile}
              className="flex items-center gap-1"
            >
              <FileDown size={14} />
              Download BingSiteAuth.xml
            </Button>
            <a 
              href="https://www.bing.com/webmasters/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <ExternalLink size={14} />
                Bing Webmaster Tools
              </Button>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default BingVerificationInfo;
