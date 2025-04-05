
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AffiliateLinkCardProps = {
  affiliateCode: string;
  getAffiliateLink: (code: string) => string;
};

const AffiliateLinkCard = ({ affiliateCode, getAffiliateLink }: AffiliateLinkCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const affiliateLink = getAffiliateLink(affiliateCode);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({
      title: 'Link Copied',
      description: 'Affiliate link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Your Affiliate Link</CardTitle>
        <CardDescription>
          Share this link with potential clients to earn commission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="bg-muted p-2 rounded flex-1 text-sm overflow-hidden">
            <div className="truncate">{affiliateLink}</div>
          </div>
          <Button 
            onClick={copyToClipboard}
            size="sm"
            className={copied ? "bg-green-600" : ""}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-medium">Your Code:</span> {affiliateCode}
        </p>
      </CardContent>
    </Card>
  );
};

export default AffiliateLinkCard;
