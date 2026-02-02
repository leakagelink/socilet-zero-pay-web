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
  paid_amount: number | null;
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
  paid_amount: string;
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
  paid_amount: '',
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
      
      const totalAmount = parseFloat(formData.amount) || 0;
      const paidAmount = parseFloat(formData.paid_amount) || 0;
      
      // Auto-determine status based on paid amount
      let status = formData.status;
      if (paidAmount >= totalAmount && totalAmount > 0) {
        status = 'paid';
      } else if (paidAmount > 0 && paidAmount < totalAmount) {
        status = 'partial';
      } else if (paidAmount === 0) {
        status = 'pending';
      }

      const incomeData = {
        client_name: formData.client_name.trim(),
        work_description: formData.work_description.trim(),
        amount: totalAmount,
        paid_amount: paidAmount,
        payment_method: formData.payment_method || null,
        payment_date: formData.payment_date,
        notes: formData.notes.trim() || null,
        status: status,
        due_date: (status === 'pending' || status === 'partial') && formData.due_date ? formData.due_date : null,
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
      paid_amount: (income.paid_amount || 0).toString(),
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
  const totalPaidAmount = incomes.reduce((sum, inc) => sum + (inc.paid_amount || 0), 0);
  const totalRemainingAmount = totalIncome - totalPaidAmount;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Other Income</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm font-normal">
            <span className="text-muted-foreground">Total: {formatCurrency(totalIncome)}</span>
            <span className="text-emerald-600 dark:text-emerald-400">Received: {formatCurrency(totalPaidAmount)}</span>
            <span className="text-amber-600 dark:text-amber-400">Remaining: {formatCurrency(totalRemainingAmount)}</span>
          </div>
        </CardTitle>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm" className="w-full sm:w-auto h-8 sm:h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-lg bg-muted/30 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="client_name" className="text-sm">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Enter client name"
                  required
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="work_description" className="text-sm">Work/Project/Service *</Label>
                <Input
                  id="work_description"
                  value={formData.work_description}
                  onChange={(e) => setFormData({ ...formData, work_description: e.target.value })}
                  placeholder="e.g., Freelance Design, Consulting"
                  required
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="amount" className="text-sm">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="paid_amount" className="text-sm">Paid Amount (₹)</Label>
                <Input
                  id="paid_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  max={formData.amount || undefined}
                  value={formData.paid_amount}
                  onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                  placeholder="Amount received so far"
                  className="h-9 sm:h-10"
                />
                {formData.amount && formData.paid_amount && (
                  <p className="text-xs text-muted-foreground">
                    Remaining: {formatCurrency((parseFloat(formData.amount) || 0) - (parseFloat(formData.paid_amount) || 0))}
                  </p>
                )}
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

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="payment_date" className="text-sm">Payment Date</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="due_date" className="text-sm">Due Date (for remaining)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="h-9 sm:h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="notes" className="text-sm">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes..."
                rows={2}
                className="text-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
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
            </div>
          </form>
        )}

        {incomes.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <Wallet className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No other income recorded yet</p>
            <p className="text-xs sm:text-sm">Click "Add Income" to add your first entry</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Work/Service</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.map((income) => {
                    const paidAmt = income.paid_amount || 0;
                    const remainingAmt = income.amount - paidAmt;
                    return (
                    <TableRow key={income.id}>
                      <TableCell className="font-medium">{income.client_name}</TableCell>
                      <TableCell>{income.work_description}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCurrency(paidAmt)}
                      </TableCell>
                      <TableCell className="text-amber-600 dark:text-amber-400 font-semibold">
                        {formatCurrency(remainingAmt)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          income.status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : income.status === 'partial'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {income.status === 'paid' ? 'Paid' : income.status === 'partial' ? 'Partial' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(income.payment_date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        {(income.status === 'pending' || income.status === 'partial') && income.due_date 
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
                  );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y -mx-3 sm:-mx-0">
              {incomes.map((income) => {
                const paidAmt = income.paid_amount || 0;
                const remainingAmt = income.amount - paidAmt;
                return (
                <div key={income.id} className="p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{income.client_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{income.work_description}</p>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      income.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : income.status === 'partial'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {income.status === 'paid' ? 'Paid' : income.status === 'partial' ? 'Partial' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-2">
                      <span className="font-semibold">Total: {formatCurrency(income.amount)}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Paid: {formatCurrency(paidAmt)}</span>
                      {remainingAmt > 0 && (
                        <span className="text-amber-600 dark:text-amber-400">Due: {formatCurrency(remainingAmt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(new Date(income.payment_date), 'dd MMM yyyy')}</span>
                    {(income.status === 'pending' || income.status === 'partial') && income.due_date && (
                      <span className="text-amber-600">Due: {format(new Date(income.due_date), 'dd MMM yyyy')}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(income)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Pencil className="h-3 w-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8"
                      onClick={() => handleDelete(income.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OtherIncomeManager;
