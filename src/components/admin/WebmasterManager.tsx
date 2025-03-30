
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WebmasterManager = () => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClearCache = () => {
    // Simulate clearing cache
    setTimeout(() => {
      toast.success('Cache cleared successfully');
    }, 1000);
  };

  const handleChangePassword = () => {
    // Validate current password
    if (currentPassword !== localStorage.getItem('admin-password')) {
      toast.error('Current password is incorrect');
      return;
    }

    // Validate new password
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Update password in localStorage
    localStorage.setItem('admin-password', newPassword);
    
    // Close dialog and reset forms
    setIsPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast.success('Password updated successfully');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Webmaster Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5" />
              Cache Management
            </CardTitle>
            <CardDescription>Clear the website cache to reflect recent changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Use this option to clear cached data and force reload of content.
              This may be necessary after making significant changes to the website.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleClearCache}>Clear Cache</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Admin Password
            </CardTitle>
            <CardDescription>Change your admin panel access password</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              For security, change your password regularly. Your password should be 
              at least 6 characters and include a mix of letters and numbers.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsPasswordDialogOpen(true)}>Change Password</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Other Settings
            </CardTitle>
            <CardDescription>Additional webmaster settings and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Advanced settings for website maintenance and optimization.
              (More features coming soon)
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>Manage Settings</Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Update your admin password below. Make sure to use a strong, secure password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebmasterManager;
