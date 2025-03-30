
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Copy } from 'lucide-react';

interface HtmlTagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  metaTag: string;
  onCopy: (text: string) => void;
  copySuccess: boolean;
}

const HtmlTagDialog = ({
  isOpen,
  onOpenChange,
  metaTag,
  onCopy,
  copySuccess
}: HtmlTagDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>HTML Meta Tag</DialogTitle>
          <DialogDescription>
            Add this meta tag to the &lt;head&gt; section of your website's HTML
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="meta-tag">HTML Tag</Label>
            <div className="relative">
              <Input
                id="meta-tag"
                readOnly
                value={metaTag}
                className="pr-12 font-mono text-xs"
              />
              <Button
                size="icon"
                type="button"
                variant="ghost"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => onCopy(metaTag)}
              >
                {copySuccess ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-muted p-3 rounded-md text-xs">
          <p>
            1. Copy the above meta tag<br />
            2. Paste it in the &lt;head&gt; section of your website's HTML<br />
            3. Return to Google Search Console and click "Verify"
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HtmlTagDialog;
