import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Key, Plus, Search, Edit2, Trash2, Eye, EyeOff, 
  Loader2, Save, X, Check, LogIn, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceCredential {
  id: string;
  service_name: string;
  company_name: string;
  email: string;
  encrypted_password: string;
  is_auto_login: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const UNLOCK_PASSWORD = 'Pyariiccha@123';

const ServiceCredentialsManager = () => {
  // Section unlock state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const [credentials, setCredentials] = useState<ServiceCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'manual'>('all');
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service_name: '',
    company_name: '',
    email: '',
    password: '',
    is_auto_login: false,
    notes: '',
  });

  // Password visibility states
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<Set<string>>(new Set());
  const [passwordVerifyDialogOpen, setPasswordVerifyDialogOpen] = useState(false);
  const [pendingPasswordViewId, setPendingPasswordViewId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPassword === UNLOCK_PASSWORD) {
      setIsUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError('Incorrect password');
    }
  };

  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error: any) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load service credentials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const credentialData = {
        service_name: formData.service_name.trim(),
        company_name: formData.company_name.trim(),
        email: formData.email.trim(),
        encrypted_password: formData.password, // In production, encrypt this
        is_auto_login: formData.is_auto_login,
        notes: formData.notes.trim() || null,
      };

      if (editingId) {
        // Update existing
        const updateData: any = { ...credentialData };
        if (!formData.password) {
          delete updateData.encrypted_password;
        }
        
        const { error } = await supabase
          .from('service_credentials')
          .update(updateData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Service credential updated!');
      } else {
        // Create new
        const { error } = await supabase
          .from('service_credentials')
          .insert([credentialData]);

        if (error) throw error;
        toast.success('Service credential added!');
      }

      resetForm();
      fetchCredentials();
    } catch (error: any) {
      console.error('Error saving credential:', error);
      toast.error(error.message || 'Failed to save credential');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      company_name: '',
      email: '',
      password: '',
      is_auto_login: false,
      notes: '',
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (credential: ServiceCredential) => {
    setFormData({
      service_name: credential.service_name,
      company_name: credential.company_name,
      email: credential.email,
      password: '', // Don't show password in form
      is_auto_login: credential.is_auto_login,
      notes: credential.notes || '',
    });
    setEditingId(credential.id);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', deletingId);

      if (error) throw error;
      toast.success('Service credential deleted!');
      fetchCredentials();
    } catch (error: any) {
      console.error('Error deleting credential:', error);
      toast.error('Failed to delete credential');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handlePasswordView = (id: string) => {
    if (visiblePasswordIds.has(id)) {
      // Hide password
      const newSet = new Set(visiblePasswordIds);
      newSet.delete(id);
      setVisiblePasswordIds(newSet);
    } else {
      // Show password verification dialog
      setPendingPasswordViewId(id);
      setPasswordVerifyDialogOpen(true);
      setAdminPassword('');
    }
  };

  const verifyAdminPassword = async () => {
    setIsVerifying(true);
    try {
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('User not authenticated');
        return;
      }

      // Verify password by re-authenticating
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: adminPassword,
      });

      if (error) {
        toast.error('Incorrect password');
        return;
      }

      // Password verified, show the password
      if (pendingPasswordViewId) {
        setVisiblePasswordIds(new Set([...visiblePasswordIds, pendingPasswordViewId]));
      }
      
      setPasswordVerifyDialogOpen(false);
      setAdminPassword('');
      setPendingPasswordViewId(null);
      toast.success('Password verified!');
    } catch (error: any) {
      console.error('Error verifying password:', error);
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Filter credentials
  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = 
      cred.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'auto' && cred.is_auto_login) ||
      (filterType === 'manual' && !cred.is_auto_login);

    return matchesSearch && matchesFilter;
  });

  // Show unlock screen if not unlocked
  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Protected Section</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Enter admin password to access Service Credentials Manager
              </p>
              <Input
                type="password"
                placeholder="Enter password..."
                value={unlockPassword}
                onChange={(e) => {
                  setUnlockPassword(e.target.value);
                  setUnlockError('');
                }}
                className={unlockError ? 'border-destructive' : ''}
              />
              {unlockError && (
                <p className="text-sm text-destructive text-center">{unlockError}</p>
              )}
              <Button type="submit" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Service Credentials Manager
            </CardTitle>
            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, companies, or emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v: 'all' | 'auto' | 'manual') => setFilterType(v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="auto">Auto-Login Only</SelectItem>
                <SelectItem value="manual">Manual Login Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credentials List */}
          {filteredCredentials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No service credentials found</p>
              {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCredentials.map((credential) => (
                <div
                  key={credential.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{credential.service_name}</h3>
                      <Badge variant={credential.is_auto_login ? "default" : "secondary"}>
                        {credential.is_auto_login ? (
                          <><LogIn className="h-3 w-3 mr-1" /> Auto-Login</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" /> Manual</>
                        )}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{credential.company_name}</span>
                      <span className="mx-2">•</span>
                      <span>{credential.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {visiblePasswordIds.has(credential.id) 
                          ? credential.encrypted_password 
                          : '••••••••'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePasswordView(credential.id)}
                        className="h-8 w-8 p-0"
                      >
                        {visiblePasswordIds.has(credential.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {credential.notes && (
                      <p className="text-xs text-muted-foreground">{credential.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(credential)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(credential.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Service Credential' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              Store your service login credentials securely
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service_name">Service Name *</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                placeholder="e.g., Hosting, Domain, Email Service"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g., GoDaddy, Hostinger, Google"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="login@example.com"
                required
              />
            </div>
            {!formData.is_auto_login && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {editingId ? '(leave empty to keep current)' : '*'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editingId && !formData.is_auto_login}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_auto_login"
                checked={formData.is_auto_login}
                onCheckedChange={(checked) => setFormData({ ...formData, is_auto_login: checked })}
              />
              <Label htmlFor="is_auto_login">Auto-Login Enabled</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingId ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Verification Dialog */}
      <Dialog open={passwordVerifyDialogOpen} onOpenChange={setPasswordVerifyDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Verify Admin Password
            </DialogTitle>
            <DialogDescription>
              Enter your admin password to view this credential
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyDown={(e) => e.key === 'Enter' && verifyAdminPassword()}
            />
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPasswordVerifyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={verifyAdminPassword} 
                disabled={isVerifying || !adminPassword}
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Verify
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service credential? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceCredentialsManager;
