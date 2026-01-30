import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, CalendarDays, RefreshCw, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface RecurringEarning {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  project_name: string;
  amount: number;
  frequency: string;
  billing_date: number;
  start_date: string;
  next_billing_date: string | null;
  is_active: boolean | null;
  notes: string | null;
  payment_method: string | null;
  created_at: string;
}

const emptyForm = {
  client_name: '',
  client_email: null,
  client_phone: null,
  project_name: '',
  amount: 0,
  frequency: 'monthly',
  billing_date: 1,
  start_date: new Date().toISOString().split('T')[0],
  next_billing_date: null,
  is_active: true,
  notes: null,
  payment_method: null,
};

const RecurringEarningsManager = () => {
  const [earnings, setEarnings] = useState<RecurringEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recurring_earnings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEarnings(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch recurring earnings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextBillingDate = (startDate: string, billingDate: number, frequency: string): string => {
    const today = new Date();
    let nextDate = new Date(startDate);
    nextDate.setDate(billingDate);

    while (nextDate <= today) {
      if (frequency === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
    }

    return nextDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const nextBilling = calculateNextBillingDate(formData.start_date, formData.billing_date, formData.frequency);
      const dataToSave = {
        ...formData,
        next_billing_date: nextBilling,
      };

      if (isEditing && currentId) {
        const { error } = await supabase
          .from('recurring_earnings')
          .update(dataToSave)
          .eq('id', currentId);

        if (error) throw error;
        toast.success('Recurring earning updated successfully');
      } else {
        const { error } = await supabase
          .from('recurring_earnings')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Recurring earning added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchEarnings();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
      console.error(err);
    }
  };

  const handleEdit = (earning: RecurringEarning) => {
    setFormData({
      client_name: earning.client_name,
      client_email: earning.client_email,
      client_phone: earning.client_phone,
      project_name: earning.project_name,
      amount: earning.amount,
      frequency: earning.frequency,
      billing_date: earning.billing_date,
      start_date: earning.start_date,
      next_billing_date: earning.next_billing_date,
      is_active: earning.is_active,
      notes: earning.notes,
      payment_method: earning.payment_method,
    });
    setCurrentId(earning.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring earning?')) return;

    try {
      const { error } = await supabase
        .from('recurring_earnings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Recurring earning deleted successfully');
      fetchEarnings();
    } catch (err: any) {
      toast.error('Failed to delete');
      console.error(err);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('recurring_earnings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchEarnings();
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setCurrentId(null);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate totals
  const activeEarnings = earnings.filter(e => e.is_active);
  const monthlyTotal = activeEarnings
    .filter(e => e.frequency === 'monthly')
    .reduce((sum, e) => sum + e.amount, 0);
  const yearlyTotal = activeEarnings
    .filter(e => e.frequency === 'yearly')
    .reduce((sum, e) => sum + e.amount, 0);
  const estimatedMonthly = monthlyTotal + (yearlyTotal / 12);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Est. Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(estimatedMonthly)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Monthly Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyTotal)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeEarnings.filter(e => e.frequency === 'monthly').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Yearly Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary-foreground">
              {formatCurrency(yearlyTotal)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeEarnings.filter(e => e.frequency === 'yearly').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{earnings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeEarnings.length} active, {earnings.length - activeEarnings.length} inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recurring Earnings</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : earnings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No recurring earnings found. Add your first subscription!
                    </TableCell>
                  </TableRow>
                ) : (
                  earnings.map((earning) => (
                    <TableRow key={earning.id} className={!earning.is_active ? 'opacity-50' : ''}>
                      <TableCell>
                        <button
                          onClick={() => toggleActive(earning.id, earning.is_active)}
                          className="focus:outline-none"
                        >
                          {earning.is_active ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{earning.project_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{earning.client_name}</p>
                          {earning.client_phone && (
                            <p className="text-xs text-muted-foreground">{earning.client_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatCurrency(earning.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={earning.frequency === 'monthly' ? 'default' : 'secondary'}>
                          {earning.frequency === 'monthly' ? 'Monthly' : 'Yearly'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {earning.frequency === 'monthly' 
                          ? `${earning.billing_date}${getOrdinalSuffix(earning.billing_date)} of month`
                          : `${earning.billing_date}${getOrdinalSuffix(earning.billing_date)} of year`
                        }
                      </TableCell>
                      <TableCell>{formatDate(earning.next_billing_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(earning)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(earning.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                  placeholder="e.g., Website Maintenance"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                  placeholder="Client name"
                />
              </div>
              
              <div>
                <Label htmlFor="client_phone">Client Phone</Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone || ''}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email || ''}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="client@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: 'monthly' | 'yearly') => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="billing_date">Billing Day *</Label>
                <Input
                  id="billing_date"
                  type="number"
                  value={formData.billing_date}
                  onChange={(e) => setFormData({ ...formData, billing_date: parseInt(e.target.value) || 1 })}
                  required
                  min="1"
                  max="31"
                  placeholder="1-31"
                />
              </div>
              
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method || ''}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active Subscription</Label>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Subscription
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function for ordinal suffix
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default RecurringEarningsManager;
