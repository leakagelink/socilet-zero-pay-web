
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy, CheckCheck } from "lucide-react";

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
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" /> Your Affiliate Link
        </CardTitle>
        <CardDescription>
          Share this link with potential clients to earn 25% commission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="bg-muted p-3 rounded-md flex-1 text-sm font-mono">
            <div className="truncate">{affiliateLink}</div>
          </div>
          <Button 
            onClick={copyToClipboard}
            size="sm"
            variant={copied ? "default" : "secondary"}
            className={copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            {copied ? (
              <>
                <CheckCheck className="mr-2 h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          <span className="font-semibold">Your Code:</span> {affiliateCode}
        </p>
      </CardContent>
    </Card>
  );
};

export default AffiliateLinkCard;
