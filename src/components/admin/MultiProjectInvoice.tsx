import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, FileText, Download, Send, Check, ChevronDown, Printer, CreditCard, Building2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface SavedPaymentMethod {
  id: string;
  method_type: string;
  label: string;
  upi_id: string | null;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_holder: string | null;
  payment_link: string | null;
  qr_image_url: string | null;
  is_default: boolean | null;
}

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  project_status: string;
  total_amount: number | null;
  advance_amount: number | null;
  remaining_amount: number | null;
  deadline: string | null;
  start_date: string | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-700';
    case 'in_progress': case 'running': return 'bg-blue-100 text-blue-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-muted text-muted-foreground';
  }
};

interface MultiProjectInvoiceProps {
  onInvoiceCreated?: () => void;
}

const MultiProjectInvoice: React.FC<MultiProjectInvoiceProps> = ({ onInvoiceCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [taxRate, setTaxRate] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchSavedPaymentMethods();
    }
  }, [isOpen]);

  const fetchSavedPaymentMethods = async () => {
    const { data } = await supabase
      .from('saved_payment_methods')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    setSavedPaymentMethods((data as any) || []);
    // Auto-select default
    const defaultMethod = (data as any)?.find((m: any) => m.is_default);
    if (defaultMethod) applyPaymentMethod(defaultMethod);
  };

  const applyPaymentMethod = (method: SavedPaymentMethod) => {
    setSelectedPaymentMethodId(method.id);
    setUpiId(method.upi_id || '');
    setBankName(method.bank_name || '');
    setAccountNumber(method.account_number || '');
    setIfscCode(method.ifsc_code || '');
    setAccountHolder(method.account_holder || '');
    setPaymentLink(method.payment_link || '');
    setQrImageUrl(method.qr_image_url || '');
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, client_email, client_phone, project_status, total_amount, advance_amount, remaining_amount, deadline, start_date')
        .order('client_name');
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
  };

  const clientNames = [...new Set(projects.map(p => p.client_name))].sort();
  const clientProjects = projects.filter(p => p.client_name === selectedClient);
  const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));

  const clientInfo = clientProjects.length > 0 ? {
    email: clientProjects[0].client_email || '',
    phone: clientProjects[0].client_phone || '',
  } : { email: '', phone: '' };

  const subtotal = selectedProjects.reduce((sum, p) => sum + (p.total_amount || 0), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount - discountAmount;
  const totalPaid = selectedProjects.reduce((sum, p) => sum + (p.advance_amount || 0), 0);
  const totalRemaining = selectedProjects.reduce((sum, p) => sum + (p.remaining_amount || 0), 0);
  const paidPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  const invoiceNumber = `INV-${Date.now()}`;

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllClientProjects = () => {
    if (selectedProjectIds.length === clientProjects.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(clientProjects.map(p => p.id));
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download invoice');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${selectedClient}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #111; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleSaveInvoice = async () => {
    if (selectedProjects.length === 0) return;
    setSaving(true);

    try {
      const items = selectedProjects.map(p => ({
        description: `${p.project_name} (${p.project_status.toUpperCase()})`,
        quantity: 1,
        rate: p.total_amount || 0,
        amount: p.total_amount || 0,
      }));

      const { error } = await supabase.from('invoices').insert([{
        invoice_number: invoiceNumber,
        client_name: selectedClient,
        client_email: clientInfo.email || null,
        client_phone: clientInfo.phone || null,
        items: items as any,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        paid_amount: totalPaid,
        due_date: dueDate || null,
        notes: notes || null,
        status: 'draft' as any,
      }]);

      if (error) throw error;
      toast.success('Invoice saved successfully!');
      onInvoiceCreated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!clientInfo.email) {
      toast.error('Client email not available');
      return;
    }
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          clientEmail: clientInfo.email,
          clientName: selectedClient,
          invoiceNumber,
          projects: selectedProjects.map(p => ({
            project_name: p.project_name,
            project_status: p.project_status,
            total_amount: p.total_amount || 0,
            advance_amount: p.advance_amount || 0,
            remaining_amount: p.remaining_amount || 0,
            deadline: p.deadline,
          })),
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          totalPaid,
          totalRemaining,
          dueDate: dueDate || null,
          notes: notes || null,
          upiId: upiId || null,
          paymentLink: paymentLink || null,
          bankName: bankName || null,
          accountHolder: accountHolder || null,
          accountNumber: accountNumber || null,
          ifscCode: ifscCode || null,
          qrImageUrl: qrImageUrl || null,
        },
      });

      if (error) throw error;
      toast.success(`Invoice sent to ${clientInfo.email}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invoice');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setStep('select');
    setSelectedClient('');
    setSelectedProjectIds([]);
    setTaxRate(0);
    setDiscountAmount(0);
    setDueDate('');
    setNotes('');
    setUpiId('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolder('');
    setPaymentLink('');
    setSelectedPaymentMethodId('');
    setQrImageUrl('');
  };

  return (
    <>
      <Button onClick={() => { reset(); setIsOpen(true); }} variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
        <Users className="h-4 w-4" /> Client Invoice
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {step === 'select' ? 'Select Client & Projects' : `Invoice Preview — ${selectedClient}`}
            </DialogTitle>
          </DialogHeader>

          {step === 'select' && (
            <div className="space-y-6 py-2">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">1. Select Client</Label>
                <Select value={selectedClient || 'none'} onValueChange={(v) => { setSelectedClient(v === 'none' ? '' : v); setSelectedProjectIds([]); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose a client</SelectItem>
                    {clientNames.map(name => (
                      <SelectItem key={name} value={name}>
                        {name} ({projects.filter(p => p.client_name === name).length} projects)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Selection */}
              {selectedClient && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">2. Select Projects</Label>
                    <Button variant="outline" size="sm" onClick={selectAllClientProjects}>
                      {selectedProjectIds.length === clientProjects.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>

                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {clientProjects.map(project => (
                      <label
                        key={project.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProjectIds.includes(project.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={selectedProjectIds.includes(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{project.project_name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge className={`text-xs ${getStatusColor(project.project_status)}`}>{project.project_status}</Badge>
                            <span className="text-xs text-muted-foreground">Total: {formatCurrency(project.total_amount || 0)}</span>
                            <span className="text-xs text-emerald-600">Paid: {formatCurrency(project.advance_amount || 0)}</span>
                            <span className="text-xs text-red-500">Due: {formatCurrency(project.remaining_amount || 0)}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedProjectIds.length > 0 && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Tax Rate (%)</Label>
                          <Input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount (₹)</Label>
                          <Input type="number" min="0" value={discountAmount} onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes for the invoice..." rows={2} />
                      </div>

                      {/* Payment Details */}
                      <Separator />
                      <Label className="text-base font-semibold">3. Payment Details (Optional)</Label>
                      
                      {savedPaymentMethods.length > 0 && (
                        <div className="space-y-2">
                          <Label>Select Saved Payment Method</Label>
                          <Select value={selectedPaymentMethodId || 'none'} onValueChange={(v) => {
                            if (v === 'none') {
                              setSelectedPaymentMethodId('');
                              setUpiId(''); setBankName(''); setAccountNumber('');
                              setIfscCode(''); setAccountHolder(''); setPaymentLink(''); setQrImageUrl('');
                              return;
                            }
                            const method = savedPaymentMethods.find(m => m.id === v);
                            if (method) applyPaymentMethod(method);
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose saved payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- Manual Entry --</SelectItem>
                              {savedPaymentMethods.map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.method_type.toUpperCase()} — {m.label} {m.is_default ? '⭐' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>UPI ID</Label>
                        <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. socilet@upi" />
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Link (GPay/PhonePe/Razorpay etc.)</Label>
                        <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://pay.google.com/..." />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Bank Name</Label>
                          <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. State Bank of India" />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Holder Name</Label>
                          <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="e.g. Socilet Technologies" />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Number</Label>
                          <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. 1234567890" />
                        </div>
                        <div className="space-y-2">
                          <Label>IFSC Code</Label>
                          <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="e.g. SBIN0001234" />
                        </div>
                      </div>

                      {qrImageUrl && (
                        <div className="space-y-2">
                          <Label>QR Code Preview</Label>
                          <img src={qrImageUrl} alt="QR Code" className="w-32 h-32 rounded-lg border object-contain" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => setStep('preview')}
                  disabled={selectedProjectIds.length === 0}
                >
                  Preview Invoice ({selectedProjectIds.length} projects)
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setStep('select')}>← Back</Button>
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button
                  onClick={handleSaveInvoice}
                  disabled={saving}
                  variant="outline"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Invoice'}
                </Button>
                {clientInfo.email && (
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending}
                    className="gap-2 bg-primary"
                  >
                    <Send className="h-4 w-4" /> {sending ? 'Sending...' : `Email to ${clientInfo.email}`}
                  </Button>
                )}
              </div>

              {/* Printable Invoice */}
              <div ref={invoiceRef} style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '3px solid #6366f1', paddingBottom: '20px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', margin: 0 }}>SOCILET</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>Web & App Development Agency</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0' }}>hello@socilet.in | www.socilet.in</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: 0 }}>INVOICE</h2>
                    <p style={{ fontSize: '14px', color: '#6366f1', fontWeight: 600, margin: '4px 0 0' }}>{invoiceNumber}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>Date: {formatDate(new Date().toISOString())}</p>
                    {dueDate && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600, margin: '4px 0 0' }}>Due: {formatDate(dueDate)}</p>}
                  </div>
                </div>

                {/* Bill To */}
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Bill To</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: '4px 0 0' }}>{selectedClient}</p>
                  {clientInfo.email && <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>📧 {clientInfo.email}</p>}
                  {clientInfo.phone && <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>📞 {clientInfo.phone}</p>}
                </div>

                {/* Projects Table */}
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 12px', borderBottom: '2px solid #6366f1', paddingBottom: '8px' }}>📋 Project Summary ({selectedProjects.length} Projects)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Project</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Paid</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Due</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProjects.map((p, i) => (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#111', borderBottom: '1px solid #e5e7eb' }}>{p.project_name}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ 
                            display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, color: '#fff',
                            background: p.project_status === 'completed' ? '#10b981' : p.project_status === 'pending' ? '#f59e0b' : '#3b82f6'
                          }}>{p.project_status.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '14px', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{formatCurrency(p.total_amount || 0)}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '14px', color: '#10b981', borderBottom: '1px solid #e5e7eb' }}>{formatCurrency(p.advance_amount || 0)}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '14px', color: '#ef4444', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{formatCurrency(p.remaining_amount || 0)}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{formatDate(p.deadline)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '300px', background: '#f9fafb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151' }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                    </div>
                    {taxAmount > 0 && (
                      <div style={{ padding: '6px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151' }}>
                        <span>Tax ({taxRate}%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div style={{ padding: '6px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#ef4444' }}>
                        <span>Discount</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, color: '#6366f1', borderTop: '2px solid #e5e7eb' }}>
                      <span>Grand Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div style={{ padding: '8px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10b981', fontWeight: 600, background: '#ecfdf5' }}>
                      <span>Amount Paid</span>
                      <span>{formatCurrency(totalPaid)}</span>
                    </div>
                    <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#ef4444', fontWeight: 700, background: '#fef2f2' }}>
                      <span>Amount Due</span>
                      <span>{formatCurrency(totalRemaining)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Progress */}
                <div style={{ marginTop: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px' }}>Payment Progress: {paidPercentage}%</p>
                  <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', height: '100%', width: `${paidPercentage}%`, borderRadius: '10px' }}></div>
                  </div>
                </div>

                {notes && (
                  <div style={{ marginTop: '20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', margin: 0 }}>📝 Notes</p>
                    <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0 0' }}>{notes}</p>
                  </div>
                )}

                {/* Payment Details */}
                {(upiId || paymentLink || bankName || qrImageUrl) && (
                  <div style={{ marginTop: '20px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '16px 20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#4338ca', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>💳 Payment Details</h4>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        {upiId && (
                          <div style={{ marginBottom: '10px', padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>UPI ID</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#4338ca', margin: '4px 0 0' }}>{upiId}</p>
                          </div>
                        )}

                        {paymentLink && (
                          <div style={{ marginBottom: '10px', padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Link</p>
                            <a href={paymentLink} style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1', margin: '4px 0 0', display: 'block', wordBreak: 'break-all' }}>{paymentLink}</a>
                          </div>
                        )}

                        {bankName && (
                          <div style={{ padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Transfer Details</p>
                            <table style={{ width: '100%' }}>
                              <tbody>
                                {accountHolder && <tr><td style={{ fontSize: '13px', color: '#6b7280', padding: '2px 0' }}>Account Holder:</td><td style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{accountHolder}</td></tr>}
                                <tr><td style={{ fontSize: '13px', color: '#6b7280', padding: '2px 0' }}>Bank:</td><td style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{bankName}</td></tr>
                                {accountNumber && <tr><td style={{ fontSize: '13px', color: '#6b7280', padding: '2px 0' }}>Account No:</td><td style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{accountNumber}</td></tr>}
                                {ifscCode && <tr><td style={{ fontSize: '13px', color: '#6b7280', padding: '2px 0' }}>IFSC Code:</td><td style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{ifscCode}</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {qrImageUrl && (
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scan to Pay</p>
                          <img src={qrImageUrl} alt="Payment QR Code" style={{ width: '140px', height: '140px', borderRadius: '8px', border: '2px solid #e0e7ff', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: '#374151', fontWeight: 600, margin: 0 }}>Thank you for choosing Socilet! 🙏</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>📧 hello@socilet.in | 🌐 www.socilet.in</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiProjectInvoice;
