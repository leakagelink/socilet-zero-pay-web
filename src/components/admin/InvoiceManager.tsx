import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, FileText, Eye, Edit, Trash2, Send, Download, Search, X, Printer, Check } from 'lucide-react';
import MultiProjectInvoice from './MultiProjectInvoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  project_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  due_date: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes: string | null;
  created_at: string;
}

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
}

const emptyItem: InvoiceItem = { description: '', quantity: 1, rate: 0, amount: 0 };

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<{
    project_id: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_address: string;
    items: InvoiceItem[];
    tax_rate: number;
    discount_amount: number;
    due_date: string;
    notes: string;
    status: Invoice['status'];
  }>({
    project_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    items: [{ ...emptyItem }],
    tax_rate: 0,
    discount_amount: 0,
    due_date: '',
    notes: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(inv => ({
        ...inv,
        items: (inv.items as unknown as InvoiceItem[]) || [],
        status: inv.status as Invoice['status']
      }));
      
      setInvoices(typedData);
    } catch (error: any) {
      toast.error('Failed to fetch invoices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, client_email, client_phone')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const calculateTotals = (items: InvoiceItem[], taxRate: number, discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, totalAmount };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleProjectSelect = (projectId: string) => {
    if (projectId === 'none') {
      setFormData({ ...formData, project_id: '' });
      return;
    }
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setFormData({
        ...formData,
        project_id: projectId,
        client_name: project.client_name,
        client_email: project.client_email || '',
        client_phone: project.client_phone || '',
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.client_name.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (formData.items.every(item => !item.description.trim())) {
      toast.error('At least one item is required');
      return;
    }

    const { subtotal, taxAmount, totalAmount } = calculateTotals(
      formData.items, formData.tax_rate, formData.discount_amount
    );

    try {
      if (selectedInvoice) {
        // Update existing invoice
        const updateData = {
          project_id: formData.project_id || null,
          client_name: formData.client_name,
          client_email: formData.client_email || null,
          client_phone: formData.client_phone || null,
          client_address: formData.client_address || null,
          items: formData.items as unknown as any,
          subtotal,
          tax_rate: formData.tax_rate,
          tax_amount: taxAmount,
          discount_amount: formData.discount_amount,
          total_amount: totalAmount,
          due_date: formData.due_date || null,
          notes: formData.notes || null,
          status: formData.status as any,
        };

        const { error } = await supabase
          .from('invoices')
          .update(updateData)
          .eq('id', selectedInvoice.id);
        if (error) throw error;
        toast.success('Invoice updated successfully');
      } else {
        // Create new invoice - invoice_number is auto-generated by trigger
        const insertData = {
          invoice_number: `INV-${Date.now()}`, // Temporary, will be replaced by trigger
          project_id: formData.project_id || null,
          client_name: formData.client_name,
          client_email: formData.client_email || null,
          client_phone: formData.client_phone || null,
          client_address: formData.client_address || null,
          items: formData.items as unknown as any,
          subtotal,
          tax_rate: formData.tax_rate,
          tax_amount: taxAmount,
          discount_amount: formData.discount_amount,
          total_amount: totalAmount,
          due_date: formData.due_date || null,
          notes: formData.notes || null,
          status: formData.status as any,
        };

        const { error } = await supabase
          .from('invoices')
          .insert([insertData]);
        if (error) throw error;
        toast.success('Invoice created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save invoice');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch (error: any) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleStatusChange = async (id: string, status: Invoice['status']) => {
    try {
      const updateData: any = { status };
      if (status === 'paid') {
        const invoice = invoices.find(i => i.id === id);
        if (invoice) {
          updateData.paid_amount = invoice.total_amount;
        }
      }
      
      const { error } = await supabase.from('invoices').update(updateData).eq('id', id);
      if (error) throw error;
      toast.success('Status updated');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      client_address: '',
      items: [{ ...emptyItem }],
      tax_rate: 0,
      discount_amount: 0,
      due_date: '',
      notes: '',
      status: 'draft',
    });
    setSelectedInvoice(null);
  };

  const openEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      project_id: invoice.project_id || '',
      client_name: invoice.client_name,
      client_email: invoice.client_email || '',
      client_phone: invoice.client_phone || '',
      client_address: invoice.client_address || '',
      items: invoice.items.length > 0 ? invoice.items : [{ ...emptyItem }],
      tax_rate: invoice.tax_rate,
      discount_amount: invoice.discount_amount,
      due_date: invoice.due_date || '',
      notes: invoice.notes || '',
      status: invoice.status,
    });
    setIsDialogOpen(true);
  };

  const openView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const variants: Record<Invoice['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      draft: { variant: 'secondary', className: 'bg-slate-100 text-slate-700' },
      sent: { variant: 'default', className: 'bg-blue-100 text-blue-700' },
      paid: { variant: 'default', className: 'bg-emerald-100 text-emerald-700' },
      overdue: { variant: 'destructive', className: 'bg-red-100 text-red-700' },
      cancelled: { variant: 'outline', className: 'bg-gray-100 text-gray-500' },
    };
    return <Badge className={variants[status].className}>{status.toUpperCase()}</Badge>;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { subtotal, taxAmount, totalAmount } = calculateTotals(
    formData.items, formData.tax_rate, formData.discount_amount
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <CardTitle className="text-xl">Invoice Manager</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <MultiProjectInvoice onInvoiceCreated={fetchInvoices} />
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" /> Create Invoice
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Project Selection */}
                <div className="space-y-2">
                  <Label>Link to Project (Optional)</Label>
                  <Select value={formData.project_id || 'none'} onValueChange={handleProjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.project_name} - {project.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <Input
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="Client name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Email</Label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Phone</Label>
                    <Input
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Client Address</Label>
                  <Textarea
                    value={formData.client_address}
                    onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                    placeholder="Full address"
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Invoice Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Invoice Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg">
                      <div className="col-span-12 sm:col-span-5 space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1">
                        <Label className="text-xs">Rate (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2 space-y-1">
                        <Label className="text-xs">Amount</Label>
                        <Input value={formatCurrency(item.amount)} disabled className="bg-muted" />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.tax_rate}
                        onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.discount_amount}
                        onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(v: Invoice['status']) => setFormData({ ...formData, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({formData.tax_rate}%):</span>
                      <span className="font-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                    {formData.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-destructive">
                        <span>Discount:</span>
                        <span>-{formatCurrency(formData.discount_amount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>{selectedInvoice ? 'Update' : 'Create'} Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invoices found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-primary">{invoice.invoice_number}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="font-medium text-foreground truncate">{invoice.client_name}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                    <span>Amount: <span className="font-semibold text-foreground">{formatCurrency(invoice.total_amount)}</span></span>
                    {invoice.due_date && <span>Due: {new Date(invoice.due_date).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openView(invoice)} title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(invoice)} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {invoice.status !== 'paid' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleStatusChange(invoice.id, 'paid')}
                      title="Mark as Paid"
                      className="text-emerald-600 hover:bg-emerald-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(invoice.id)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              Invoice {selectedInvoice?.invoice_number}
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedInvoice.client_name}</h3>
                  {selectedInvoice.client_email && <p className="text-sm text-muted-foreground">{selectedInvoice.client_email}</p>}
                  {selectedInvoice.client_phone && <p className="text-sm text-muted-foreground">{selectedInvoice.client_phone}</p>}
                  {selectedInvoice.client_address && <p className="text-sm text-muted-foreground mt-2">{selectedInvoice.client_address}</p>}
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedInvoice.status)}
                  {selectedInvoice.due_date && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Due: {new Date(selectedInvoice.due_date).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 text-sm py-2">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.rate)}</div>
                    <div className="col-span-2 text-right font-medium">{formatCurrency(item.amount)}</div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.tax_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax ({selectedInvoice.tax_rate}%):</span>
                    <span>{formatCurrency(selectedInvoice.tax_amount)}</span>
                  </div>
                )}
                {selectedInvoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedInvoice.discount_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(selectedInvoice.total_amount)}</span>
                </div>
                {selectedInvoice.paid_amount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Paid:</span>
                    <span>{formatCurrency(selectedInvoice.paid_amount)}</span>
                  </div>
                )}
              </div>

              {selectedInvoice.notes && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InvoiceManager;
