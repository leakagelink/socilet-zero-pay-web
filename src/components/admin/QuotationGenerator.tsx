import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Save, FileText, Download, Loader2, Eye, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Quotation {
  id: string;
  quotation_number: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  project_title: string;
  project_description: string | null;
  items: QuotationItem[];
  subtotal: number;
  tax_rate: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  total_amount: number;
  validity_days: number | null;
  terms_conditions: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

const defaultTerms = `1. This quotation is valid for the specified validity period from the date of issue.
2. 30% advance payment required to start the project.
3. Final payment due upon project completion.
4. Additional features not listed will be quoted separately.
5. Timeline may vary based on client feedback and revisions.
6. All prices are in Indian Rupees (INR).`;

const QuotationGenerator = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validityDays, setValidityDays] = useState(30);
  const [termsConditions, setTermsConditions] = useState(defaultTerms);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse items JSON
      const parsed = (data || []).map(q => ({
        ...q,
        items: Array.isArray(q.items) ? q.items : (typeof q.items === 'string' ? JSON.parse(q.items) : [])
      })) as Quotation[];
      
      setQuotations(parsed);
    } catch (err) {
      console.error('Error fetching quotations:', err);
      toast.error('Failed to load quotations');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateItemAmount = (quantity: number, rate: number) => quantity * rate;

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = calculateItemAmount(
        field === 'quantity' ? Number(value) : newItems[index].quantity,
        field === 'rate' ? Number(value) : newItems[index].rate
      );
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      description: '', 
      quantity: 1, 
      rate: 0, 
      amount: 0 
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, total };
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientAddress('');
    setProjectTitle('');
    setProjectDescription('');
    setItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
    setTaxRate(18);
    setDiscountAmount(0);
    setValidityDays(30);
    setTermsConditions(defaultTerms);
    setNotes('');
    setStatus('draft');
    setEditingId(null);
  };

  const loadQuotationForEdit = (quotation: Quotation) => {
    setEditingId(quotation.id);
    setClientName(quotation.client_name);
    setClientEmail(quotation.client_email || '');
    setClientPhone(quotation.client_phone || '');
    setClientAddress(quotation.client_address || '');
    setProjectTitle(quotation.project_title);
    setProjectDescription(quotation.project_description || '');
    setItems(quotation.items.length > 0 ? quotation.items : [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
    setTaxRate(quotation.tax_rate || 18);
    setDiscountAmount(quotation.discount_amount || 0);
    setValidityDays(quotation.validity_days || 30);
    setTermsConditions(quotation.terms_conditions || defaultTerms);
    setNotes(quotation.notes || '');
    setStatus(quotation.status);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!clientName.trim() || !projectTitle.trim()) {
      toast.error('Client name and project title are required');
      return;
    }

    if (items.every(item => !item.description.trim())) {
      toast.error('At least one item is required');
      return;
    }

    setIsSaving(true);
    const { subtotal, taxAmount, total } = calculateTotals();

    try {
      // Convert items to JSON-compatible format
      const itemsJson = items.filter(item => item.description.trim()).map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      }));

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('quotations')
          .update({
            client_name: clientName.trim(),
            client_email: clientEmail.trim() || null,
            client_phone: clientPhone.trim() || null,
            client_address: clientAddress.trim() || null,
            project_title: projectTitle.trim(),
            project_description: projectDescription.trim() || null,
            items: itemsJson,
            subtotal,
            tax_rate: taxRate,
            tax_amount: taxAmount,
            discount_amount: discountAmount,
            total_amount: total,
            validity_days: validityDays,
            terms_conditions: termsConditions.trim() || null,
            notes: notes.trim() || null,
            status,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Quotation updated successfully');
      } else {
        // Generate quotation number
        const { data: numData } = await supabase.rpc('generate_quotation_number');
        const quotationNumber = numData || `QT-${Date.now()}`;

        const { error } = await supabase
          .from('quotations')
          .insert([{
            quotation_number: quotationNumber,
            client_name: clientName.trim(),
            client_email: clientEmail.trim() || null,
            client_phone: clientPhone.trim() || null,
            client_address: clientAddress.trim() || null,
            project_title: projectTitle.trim(),
            project_description: projectDescription.trim() || null,
            items: itemsJson,
            subtotal,
            tax_rate: taxRate,
            tax_amount: taxAmount,
            discount_amount: discountAmount,
            total_amount: total,
            validity_days: validityDays,
            terms_conditions: termsConditions.trim() || null,
            notes: notes.trim() || null,
            status,
          }]);

        if (error) throw error;
        toast.success('Quotation created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchQuotations();
    } catch (err: any) {
      console.error('Error saving quotation:', err);
      toast.error(err.message || 'Failed to save quotation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const { error } = await supabase.from('quotations').delete().eq('id', id);
      if (error) throw error;
      toast.success('Quotation deleted');
      fetchQuotations();
    } catch (err) {
      console.error('Error deleting quotation:', err);
      toast.error('Failed to delete quotation');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quotation Generator</h2>
          <p className="text-muted-foreground">Create and manage project quotations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Quotation' : 'Create New Quotation'}</DialogTitle>
              <DialogDescription>Fill in the details to generate a professional quotation</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pb-4">
              <div className="space-y-6 pb-4">
                {/* Client Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Client Name *</Label>
                      <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Email address" type="email" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Phone number" />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Address" />
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Project Title *</Label>
                      <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g., E-commerce Website Development" />
                    </div>
                    <div>
                      <Label>Project Description</Label>
                      <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Brief description of the project scope" rows={3} />
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Line Items</span>
                      <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-6 sm:col-span-5">
                            <Label className={index === 0 ? '' : 'sr-only'}>Description</Label>
                            <Input 
                              value={item.description} 
                              onChange={(e) => updateItem(index, 'description', e.target.value)} 
                              placeholder="Item description" 
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-2">
                            <Label className={index === 0 ? '' : 'sr-only'}>Qty</Label>
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} 
                              min={1}
                            />
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <Label className={index === 0 ? '' : 'sr-only'}>Rate</Label>
                            <Input 
                              type="number" 
                              value={item.rate} 
                              onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} 
                              min={0}
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-2">
                            <Label className={index === 0 ? '' : 'sr-only'}>Amount</Label>
                            <Input value={formatCurrency(item.amount)} disabled className="bg-muted" />
                          </div>
                          <div className="col-span-1">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={items.length === 1} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span>Tax</span>
                          <Input 
                            type="number" 
                            value={taxRate} 
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
                            className="w-16 h-7 text-xs"
                            min={0}
                            max={100}
                          />
                          <span>%</span>
                        </div>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span>Discount</span>
                          <Input 
                            type="number" 
                            value={discountAmount} 
                            onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)} 
                            className="w-24 h-7 text-xs"
                            min={0}
                          />
                        </div>
                        <span className="text-destructive">-{formatCurrency(discountAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Validity (Days)</Label>
                        <Input type="number" value={validityDays} onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)} min={1} />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Terms & Conditions</Label>
                      <Textarea value={termsConditions} onChange={(e) => setTermsConditions(e.target.value)} rows={5} />
                    </div>
                    <div>
                      <Label>Notes (Internal)</Label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes (not shown to client)" rows={2} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? 'Update' : 'Create'} Quotation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quotations List */}
      <Card>
        <CardContent className="p-0">
          {quotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Quotations Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first quotation to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.quotation_number}</TableCell>
                    <TableCell>{q.client_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{q.project_title}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(q.total_amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(q.status)}>{q.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(q.created_at).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedQuotation(q); setIsViewDialogOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => loadQuotationForEdit(q)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Quotation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
            <DialogDescription>{selectedQuotation?.quotation_number}</DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-6 p-4 bg-white dark:bg-slate-900 rounded-lg border">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">QUOTATION</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedQuotation.quotation_number}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">Socilet</h3>
                  <p className="text-sm text-muted-foreground">socilet.in</p>
                </div>
              </div>

              {/* Client & Project Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">BILL TO</h4>
                  <p className="font-medium">{selectedQuotation.client_name}</p>
                  {selectedQuotation.client_email && <p className="text-sm">{selectedQuotation.client_email}</p>}
                  {selectedQuotation.client_phone && <p className="text-sm">{selectedQuotation.client_phone}</p>}
                  {selectedQuotation.client_address && <p className="text-sm">{selectedQuotation.client_address}</p>}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">PROJECT</h4>
                  <p className="font-medium">{selectedQuotation.project_title}</p>
                  {selectedQuotation.project_description && (
                    <p className="text-sm text-muted-foreground">{selectedQuotation.project_description}</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuotation.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Totals */}
                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedQuotation.subtotal)}</span>
                    </div>
                    {selectedQuotation.tax_amount && selectedQuotation.tax_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tax ({selectedQuotation.tax_rate}%)</span>
                        <span>{formatCurrency(selectedQuotation.tax_amount)}</span>
                      </div>
                    )}
                    {selectedQuotation.discount_amount && selectedQuotation.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-destructive">
                        <span>Discount</span>
                        <span>-{formatCurrency(selectedQuotation.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(selectedQuotation.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              {selectedQuotation.terms_conditions && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">TERMS & CONDITIONS</h4>
                  <p className="text-sm whitespace-pre-line">{selectedQuotation.terms_conditions}</p>
                </div>
              )}

              {/* Validity */}
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                Valid for {selectedQuotation.validity_days} days from {new Date(selectedQuotation.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationGenerator;
