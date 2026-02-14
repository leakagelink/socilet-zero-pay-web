import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, IndianRupee, TrendingDown, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Spend {
  id: string;
  title: string;
  category: string;
  amount: number;
  spend_date: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

const CATEGORIES = [
  'general', 'hosting', 'domain', 'software', 'tools', 'marketing',
  'salary', 'freelancer', 'office', 'travel', 'food', 'subscription', 'other'
];

const PAYMENT_METHODS = ['UPI', 'Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Other'];

const categoryColors: Record<string, string> = {
  general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  hosting: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  domain: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  software: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  tools: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  marketing: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  salary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  freelancer: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  office: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  travel: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  food: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  subscription: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const SpendManager = () => {
  const [spends, setSpends] = useState<Spend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpend, setEditingSpend] = useState<Spend | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    amount: '',
    spend_date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: '',
    notes: '',
  });

  useEffect(() => {
    fetchSpends();
  }, []);

  const fetchSpends = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('spends')
        .select('*')
        .order('spend_date', { ascending: false });

      if (error) throw error;
      setSpends(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch spends: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const spendData = {
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        spend_date: formData.spend_date,
        payment_method: formData.payment_method || null,
        notes: formData.notes || null,
      };

      if (editingSpend) {
        const { error } = await supabase
          .from('spends')
          .update(spendData)
          .eq('id', editingSpend.id);
        if (error) throw error;
        toast.success('Spend updated successfully');
      } else {
        const { error } = await supabase
          .from('spends')
          .insert(spendData);
        if (error) throw error;
        toast.success('Spend added successfully');
      }

      resetForm();
      fetchSpends();
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spend?')) return;
    try {
      const { error } = await supabase.from('spends').delete().eq('id', id);
      if (error) throw error;
      toast.success('Spend deleted');
      fetchSpends();
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleEdit = (spend: Spend) => {
    setEditingSpend(spend);
    setFormData({
      title: spend.title,
      category: spend.category,
      amount: spend.amount.toString(),
      spend_date: spend.spend_date,
      payment_method: spend.payment_method || '',
      notes: spend.notes || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'general',
      amount: '',
      spend_date: format(new Date(), 'yyyy-MM-dd'),
      payment_method: '',
      notes: '',
    });
    setEditingSpend(null);
    setIsDialogOpen(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Filter spends
  const filteredSpends = spends.filter(s => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (filterMonth !== 'all') {
      const spendMonth = format(new Date(s.spend_date), 'yyyy-MM');
      if (spendMonth !== filterMonth) return false;
    }
    return true;
  });

  // Stats
  const totalSpend = filteredSpends.reduce((sum, s) => sum + s.amount, 0);
  const thisMonthSpend = spends
    .filter(s => format(new Date(s.spend_date), 'yyyy-MM') === format(new Date(), 'yyyy-MM'))
    .reduce((sum, s) => sum + s.amount, 0);

  // Category-wise breakdown
  const categoryBreakdown = filteredSpends.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.amount;
    return acc;
  }, {} as Record<string, number>);

  // Available months for filter
  const availableMonths = [...new Set(spends.map(s => format(new Date(s.spend_date), 'yyyy-MM')))].sort().reverse();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
            <TrendingDown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Spend Tracker</h2>
            <p className="text-sm text-muted-foreground">Track all your business expenses</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2">
              <Plus className="h-4 w-4" /> Add Spend
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSpend ? 'Edit Spend' : 'Add New Spend'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Hostinger Renewal" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (₹) *</label>
                  <Input type="number" step="0.01" min="0" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))} required placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <Input type="date" value={formData.spend_date} onChange={e => setFormData(p => ({ ...p, spend_date: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select value={formData.payment_method} onValueChange={v => setFormData(p => ({ ...p, payment_method: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." rows={2} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">{editingSpend ? 'Update' : 'Add'} Spend</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-0 bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25">
          <CardHeader className="pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-red-100 flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalSpend)}</p>
            <p className="text-xs text-red-100/80 mt-1">{filteredSpends.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardHeader className="pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" /> This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(thisMonthSpend)}</p>
            <p className="text-xs text-muted-foreground mt-1">{format(new Date(), 'MMM yyyy')}</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([cat, amt]) => (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{cat}</span>
                    <span className="font-medium text-foreground">{formatCurrency(amt)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Month" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {availableMonths.map(m => (
              <SelectItem key={m} value={m}>{format(new Date(m + '-01'), 'MMM yyyy')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spends Table */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell">Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpends.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No spends found. Add your first expense!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpends.map(spend => (
                    <TableRow key={spend.id}>
                      <TableCell className="font-medium">{spend.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`capitalize text-xs ${categoryColors[spend.category] || ''}`}>
                          {spend.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(spend.amount)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {format(new Date(spend.spend_date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {spend.payment_method || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                        {spend.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(spend)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(spend.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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
    </div>
  );
};

export default SpendManager;
