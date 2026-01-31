import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, CalendarDays, RefreshCw, CheckCircle, XCircle, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type ViewMode = 'list' | 'form';

const RecurringEarningsManager = () => {
  const [earnings, setEarnings] = useState<RecurringEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingEarning, setEditingEarning] = useState<RecurringEarning | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    project_name: '',
    amount: '',
    frequency: 'monthly',
    billing_date: '1',
    start_date: new Date().toISOString().split('T')[0],
    is_active: true,
    notes: '',
    payment_method: '',
  });

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

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      project_name: '',
      amount: '',
      frequency: 'monthly',
      billing_date: '1',
      start_date: new Date().toISOString().split('T')[0],
      is_active: true,
      notes: '',
      payment_method: '',
    });
    setEditingEarning(null);
  };

  const handleAddNew = () => {
    resetForm();
    setViewMode('form');
  };

  const handleEdit = (earning: RecurringEarning) => {
    setEditingEarning(earning);
    setFormData({
      client_name: earning.client_name,
      client_email: earning.client_email || '',
      client_phone: earning.client_phone || '',
      project_name: earning.project_name,
      amount: earning.amount.toString(),
      frequency: earning.frequency,
      billing_date: earning.billing_date.toString(),
      start_date: earning.start_date,
      is_active: earning.is_active ?? true,
      notes: earning.notes || '',
      payment_method: earning.payment_method || '',
    });
    setViewMode('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nextBilling = calculateNextBillingDate(
        formData.start_date,
        parseInt(formData.billing_date) || 1,
        formData.frequency
      );

      const dataToSave = {
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        project_name: formData.project_name,
        amount: parseFloat(formData.amount) || 0,
        frequency: formData.frequency,
        billing_date: parseInt(formData.billing_date) || 1,
        start_date: formData.start_date,
        next_billing_date: nextBilling,
        is_active: formData.is_active,
        notes: formData.notes || null,
        payment_method: formData.payment_method || null,
      };

      if (editingEarning) {
        const { error } = await supabase
          .from('recurring_earnings')
          .update(dataToSave)
          .eq('id', editingEarning.id);

        if (error) throw error;
        toast.success('Subscription updated successfully');
      } else {
        const { error } = await supabase
          .from('recurring_earnings')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Subscription added successfully');
      }

      resetForm();
      setViewMode('list');
      fetchEarnings();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const { error } = await supabase
        .from('recurring_earnings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Subscription deleted successfully');
      fetchEarnings();
    } catch (err: any) {
      toast.error('Failed to delete');
      console.error(err);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean | null) => {
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

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
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

  // Form View
  if (viewMode === 'form') {
    return (
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => { resetForm(); setViewMode('list'); }} className="h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <CardTitle className="text-base sm:text-lg">{editingEarning ? 'Edit Subscription' : 'Add New Subscription'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                <Label htmlFor="project_name" className="text-sm">Project Name *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                  placeholder="e.g., Website Maintenance"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                <Label htmlFor="client_name" className="text-sm">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                  placeholder="Client name"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="client_phone" className="text-sm">Client Phone</Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="client_email" className="text-sm">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="client@email.com"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="amount" className="text-sm">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  placeholder="5000"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="frequency" className="text-sm">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger id="frequency" className="h-9 sm:h-10">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-popover">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="billing_date" className="text-sm">Billing Day (1-31) *</Label>
                <Input
                  id="billing_date"
                  type="number"
                  value={formData.billing_date}
                  onChange={(e) => setFormData({ ...formData, billing_date: e.target.value })}
                  required
                  min="1"
                  max="31"
                  placeholder="1"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="start_date" className="text-sm">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="payment_method" className="text-sm">Payment Method</Label>
                <Select
                  value={formData.payment_method || undefined}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger id="payment_method" className="h-9 sm:h-10">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-popover">
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-sm">Active Subscription</Label>
              </div>

              <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                <Label htmlFor="notes" className="text-sm">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => { resetForm(); setViewMode('list'); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingEarning ? 'Update' : 'Save'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // List View
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-primary/5 border-primary/20 col-span-2 sm:col-span-1">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              Est. Monthly
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-lg sm:text-2xl font-bold text-primary">
              {formatCurrency(estimatedMonthly)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
              Monthly
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-lg sm:text-2xl font-bold text-primary">
              {formatCurrency(monthlyTotal)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {activeEarnings.filter(e => e.frequency === 'monthly').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
              Yearly
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-lg sm:text-2xl font-bold text-secondary-foreground">
              {formatCurrency(yearlyTotal)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {activeEarnings.filter(e => e.frequency === 'yearly').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-lg sm:text-2xl font-bold text-foreground">{earnings.length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {activeEarnings.length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Recurring Earnings</h2>
        <Button onClick={handleAddNew} className="h-9 sm:h-10">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Subscription</span>
        </Button>
      </div>

      {/* Table / Mobile Cards */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
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
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
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

          {/* Mobile Card View */}
          <div className="md:hidden divide-y">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : earnings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground px-4">
                No recurring earnings found.
              </div>
            ) : (
              earnings.map((earning) => (
                <div key={earning.id} className={`p-3 sm:p-4 space-y-2.5 ${!earning.is_active ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button
                        onClick={() => toggleActive(earning.id, earning.is_active)}
                        className="focus:outline-none flex-shrink-0"
                      >
                        {earning.is_active ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{earning.project_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{earning.client_name}</p>
                      </div>
                    </div>
                    <Badge variant={earning.frequency === 'monthly' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0.5">
                      {earning.frequency === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">{formatCurrency(earning.amount)}</span>
                    <span className="text-muted-foreground">Next: {formatDate(earning.next_billing_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(earning)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Edit2 className="h-3 w-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8"
                      onClick={() => handleDelete(earning.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringEarningsManager;
