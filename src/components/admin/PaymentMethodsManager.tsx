import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, CreditCard, Building2, QrCode, Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface PaymentMethod {
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
  created_at: string;
}

const PaymentMethodsManager: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [methodType, setMethodType] = useState('upi');
  const [label, setLabel] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = async () => {
    const { data, error } = await supabase
      .from('saved_payment_methods')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) { toast.error('Failed to fetch payment methods'); return; }
    setMethods((data as any) || []);
  };

  const resetForm = () => {
    setMethodType('upi'); setLabel(''); setUpiId(''); setBankName('');
    setAccountNumber(''); setIfscCode(''); setAccountHolder('');
    setPaymentLink(''); setQrImageUrl(''); setIsDefault(false);
    setEditingMethod(null);
  };

  const openAdd = () => { resetForm(); setIsOpen(true); };

  const openEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setMethodType(m.method_type);
    setLabel(m.label);
    setUpiId(m.upi_id || '');
    setBankName(m.bank_name || '');
    setAccountNumber(m.account_number || '');
    setIfscCode(m.ifsc_code || '');
    setAccountHolder(m.account_holder || '');
    setPaymentLink(m.payment_link || '');
    setQrImageUrl(m.qr_image_url || '');
    setIsDefault(m.is_default || false);
    setIsOpen(true);
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `qr-${Date.now()}`);
      formData.append('workspaceId', 'payment-qr');

      const { data, error } = await supabase.functions.invoke('cloudinary-upload', { body: formData });
      if (error) throw error;
      if (!data?.url) throw new Error('Upload failed');
      
      setQrImageUrl(data.url);
      toast.success('QR code uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload QR');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!label.trim()) { toast.error('Label is required'); return; }
    setLoading(true);

    try {
      const payload: any = {
        method_type: methodType,
        label: label.trim(),
        upi_id: upiId || null,
        bank_name: bankName || null,
        account_number: accountNumber || null,
        ifsc_code: ifscCode || null,
        account_holder: accountHolder || null,
        payment_link: paymentLink || null,
        qr_image_url: qrImageUrl || null,
        is_default: isDefault,
      };

      if (editingMethod) {
        const { error } = await supabase.from('saved_payment_methods').update(payload).eq('id', editingMethod.id);
        if (error) throw error;
        toast.success('Payment method updated!');
      } else {
        const { error } = await supabase.from('saved_payment_methods').insert([payload]);
        if (error) throw error;
        toast.success('Payment method saved!');
      }

      setIsOpen(false);
      resetForm();
      fetchMethods();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment method?')) return;
    const { error } = await supabase.from('saved_payment_methods').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Deleted!');
    fetchMethods();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'upi': return <CreditCard className="h-4 w-4" />;
      case 'bank': return <Building2 className="h-4 w-4" />;
      case 'qr': return <QrCode className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upi': return 'bg-violet-100 text-violet-700';
      case 'bank': return 'bg-blue-100 text-blue-700';
      case 'qr': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Saved Payment Methods</h3>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Method
        </Button>
      </div>

      {methods.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No saved payment methods yet. Add your first one!</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map(m => (
            <Card key={m.id} className="relative group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getTypeColor(m.method_type)}`}>
                      {getIcon(m.method_type)} {m.method_type.toUpperCase()}
                    </Badge>
                    {m.is_default && (
                      <Badge className="text-xs bg-amber-100 text-amber-700">
                        <Star className="h-3 w-3 mr-1" /> Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(m)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="font-semibold text-sm text-foreground">{m.label}</p>
                {m.upi_id && <p className="text-xs text-muted-foreground mt-1">UPI: {m.upi_id}</p>}
                {m.bank_name && <p className="text-xs text-muted-foreground mt-1">{m.bank_name} {m.account_number ? `- ****${m.account_number.slice(-4)}` : ''}</p>}
                {m.payment_link && <p className="text-xs text-primary mt-1 truncate">🔗 {m.payment_link}</p>}
                {m.qr_image_url && (
                  <img src={m.qr_image_url} alt="QR" className="w-16 h-16 rounded mt-2 border object-contain" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'Edit' : 'Add'} Payment Method</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={methodType} onValueChange={setMethodType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="qr">QR Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Main UPI, HDFC Business" />
              </div>
            </div>

            {(methodType === 'upi' || methodType === 'qr') && (
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. business@upi" />
              </div>
            )}

            {methodType === 'bank' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" />
                </div>
                <div className="space-y-2">
                  <Label>Account Holder</Label>
                  <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Account holder name" />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="e.g. HDFC0001234" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Payment Link (Optional)</Label>
              <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://pay.google.com/..." />
            </div>

            {(methodType === 'qr' || methodType === 'upi') && (
              <div className="space-y-2">
                <Label>QR Code Image</Label>
                {qrImageUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={qrImageUrl} alt="QR" className="w-20 h-20 rounded border object-contain" />
                    <Button variant="outline" size="sm" onClick={() => setQrImageUrl('')}>
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
              <Label>Set as default</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : editingMethod ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsManager;
