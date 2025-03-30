
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Code, FileDown, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

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
  const verificationCode = "F369CBC92F03EBB72A41A8782CB42881";
  const metaTag = `<meta name="msvalidate.01" content="${verificationCode}" />`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard!"),
      () => alert("Failed to copy")
    );
  };

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

      <Alert>
        <AlertDescription>
          <span className="font-medium">Verification Code:</span> {verificationCode}
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4 absolute left-4 top-4 text-green-800" />
        <AlertDescription className="flex flex-col gap-2 pl-7">
          <div>The verification meta tag has been automatically added to your site's <code className="bg-green-100 px-1 rounded">&lt;head&gt;</code> section.</div>
          <div className="font-semibold">You can now verify your site in Bing Webmaster Tools.</div>
        </AlertDescription>
      </Alert>
      
      <div className="border rounded p-3 bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Verification Meta Tag:</h3>
        <Textarea 
          readOnly 
          value={metaTag}
          className="font-mono text-sm mb-2 bg-white"
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard(metaTag)}
          className="flex items-center gap-1"
        >
          <Code size={14} />
          Copy Meta Tag
        </Button>
      </div>

      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-4 w-4 absolute left-4 top-4 text-blue-800" />
        <AlertDescription className="flex flex-col gap-2 pl-7">
          <div><span className="font-medium">Important:</span> The verification meta tag has been automatically injected in the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your HTML, before the <code className="bg-blue-100 px-1 rounded">&lt;body&gt;</code> tag.</div>
          <div className="text-xs text-blue-600">If you're still seeing errors in Bing Webmaster Tools, try the following steps:
            <ol className="list-decimal list-inside mt-1 ml-2">
              <li>Open Bing Webmaster Tools</li>
              <li>Add your site if you haven't already</li>
              <li>Select "HTML Tag" verification method</li>
              <li>Enter the verification code: {verificationCode}</li>
              <li>Click Verify</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <a 
          href="https://www.bing.com/webmasters/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-1"
          >
            <ExternalLink size={14} />
            Go to Bing Webmaster Tools
          </Button>
        </a>
        
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
