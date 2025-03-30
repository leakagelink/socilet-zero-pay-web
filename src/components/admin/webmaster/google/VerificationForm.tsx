
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";

interface VerificationFormProps {
  siteUrl: string;
  setSiteUrl: (url: string) => void;
  verificationMethod: 'html' | 'html-file';
  setVerificationMethod: (method: 'html' | 'html-file') => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const VerificationForm = ({
  siteUrl,
  setSiteUrl,
  verificationMethod,
  setVerificationMethod,
  verificationCode,
  setVerificationCode,
  onSubmit
}: VerificationFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="site-url" className="text-right">
            Site URL
          </Label>
          <Input
            id="site-url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example.com"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="method" className="text-right">
            Method
          </Label>
          <Select 
            value={verificationMethod}
            onValueChange={(value) => setVerificationMethod(value as 'html' | 'html-file')}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html">HTML Meta Tag</SelectItem>
              <SelectItem value="html-file">HTML File</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            {verificationMethod === 'html' 
              ? 'Meta Content' 
              : 'Filename'}
          </Label>
          <Input
            id="code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={verificationMethod === 'html' 
              ? "XYZ123abc..." 
              : "googleXYZ123abc..."}
            className="col-span-3"
          />
        </div>
        <div className="col-span-4 text-xs text-muted-foreground">
          <p>
            {verificationMethod === 'html' 
              ? 'Enter only the content value from the meta tag provided by Google.' 
              : 'Enter the filename provided by Google (without .html extension).'}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save Verification</Button>
      </DialogFooter>
    </form>
  );
};

export default VerificationForm;
