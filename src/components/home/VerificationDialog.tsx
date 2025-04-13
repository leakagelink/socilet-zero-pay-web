
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info size={18} className="text-primary-600" />
            Site Verification
          </DialogTitle>
          <DialogDescription>
            Verify your website ownership with Google Search Console to improve SEO and monitor your site's performance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Follow these steps to verify your site:</p>
            <ol className="text-sm space-y-2 ml-4 list-decimal">
              <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Google Search Console</a></li>
              <li>Add your property (website URL)</li>
              <li>Select "HTML tag" verification method</li>
              <li>Copy the meta tag provided by Google</li>
              <li>Add it to the head section of your website</li>
            </ol>
          </div>
          <div className="bg-primary-50 p-3 rounded-md">
            <p className="text-xs text-primary-700">For detailed instructions, visit our admin panel and use the Google Verification tool.</p>
          </div>
        </div>
        <DialogFooter>
          <Link to="/admin">
            <Button type="button">
              Go to Admin Panel
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
