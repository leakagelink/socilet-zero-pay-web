import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Save, Loader2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface OtherIncome {
  id: string;
  client_name: string;
  work_description: string;
  amount: number;
  payment_method: string | null;
  payment_date: string;
  notes: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface FormData {
  client_name: string;
  work_description: string;
  amount: string;
  payment_method: string;
  payment_date: string;
  notes: string;
  status: string;
  due_date: string;
}

const initialFormData: FormData = {
  client_name: '',
  work_description: '',
  amount: '',
  payment_method: '',
  payment_date: new Date().toISOString().split('T')[0],
  notes: '',
  status: 'paid',
  due_date: '',
};

const OtherIncomeManager = () => {
  const [incomes, setIncomes] = useState<OtherIncome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const { data, error } = await supabase
        .from('other_income')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setIncomes(data || []);
    } catch (err: any) {
      console.error('Error fetching other income:', err);
      toast.error('Failed to load other income');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name.trim() || !formData.work_description.trim() || !formData.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const incomeData = {
        client_name: formData.client_name.trim(),
        work_description: formData.work_description.trim(),
        amount: parseFloat(formData.amount) || 0,
        payment_method: formData.payment_method || null,
        payment_date: formData.payment_date,
        notes: formData.notes.trim() || null,
        status: formData.status,
        due_date: formData.status === 'pending' && formData.due_date ? formData.due_date : null,
        created_by: user?.id || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('other_income')
          .update(incomeData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Income updated successfully!');
      } else {
        const { error } = await supabase
          .from('other_income')
          .insert([incomeData]);

        if (error) throw error;
        toast.success('Income added successfully!');
      }

      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchIncomes();
    } catch (err: any) {
      console.error('Error saving income:', err);
      toast.error(err.message || 'Failed to save income');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (income: OtherIncome) => {
    setFormData({
      client_name: income.client_name,
      work_description: income.work_description,
      amount: income.amount.toString(),
      payment_method: income.payment_method || '',
      payment_date: income.payment_date,
      notes: income.notes || '',
      status: income.status || 'paid',
      due_date: income.due_date || '',
    });
    setEditingId(income.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income?')) return;

    try {
      const { error } = await supabase
        .from('other_income')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Income deleted successfully!');
      fetchIncomes();
    } catch (err: any) {
      console.error('Error deleting income:', err);
      toast.error('Failed to delete income');
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const pendingIncome = incomes.filter(inc => inc.status === 'pending').reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const paidIncome = incomes.filter(inc => inc.status === 'paid').reduce((sum, inc) => sum + (inc.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <Wallet className="h-5 w-5" />
          Other Income
          <div className="flex gap-3 ml-2 text-sm font-normal">
            <span className="text-muted-foreground">Total: {formatCurrency(totalIncome)}</span>
            <span className="text-emerald-600 dark:text-emerald-400">Paid: {formatCurrency(paidIncome)}</span>
            <span className="text-amber-600 dark:text-amber-400">Pending: {formatCurrency(pendingIncome)}</span>
          </div>
        </CardTitle>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-muted/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_description">Work/Project/Service *</Label>
                <Input
                  id="work_description"
                  value={formData.work_description}
                  onChange={(e) => setFormData({ ...formData, work_description: e.target.value })}
                  placeholder="e.g., Freelance Design, Consulting"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method || undefined}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] bg-popover pointer-events-auto">
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">Payment Date</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value, due_date: value === 'paid' ? '' : formData.due_date })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] bg-popover pointer-events-auto">
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'pending' && (
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date (Client की दी हुई date)</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {incomes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No other income recorded yet</p>
            <p className="text-sm">Click "Add Income" to add your first entry</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Work/Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell className="font-medium">{income.client_name}</TableCell>
                    <TableCell>{income.work_description}</TableCell>
                    <TableCell className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(income.amount)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        income.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {income.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {income.payment_method?.replace('_', ' ') || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(income.payment_date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {income.status === 'pending' && income.due_date 
                        ? format(new Date(income.due_date), 'dd MMM yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(income)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(income.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OtherIncomeManager;
