import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Search, ArrowLeft, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface DigitalProduct {
  id: string;
  service_name: string;
  original_price: number;
  resell_price: number;
  profit: number;
  sale_date: string;
  payment_method: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type ViewMode = 'list' | 'form';

const DigitalProductManager = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteProductName, setDeleteProductName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    service_name: '',
    original_price: '',
    resell_price: '',
    sale_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: '',
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching digital products:', err);
      toast.error('Failed to load digital products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      service_name: '',
      original_price: '',
      resell_price: '',
      sale_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      notes: '',
    });
  };

  // Open add form
  const openAddForm = () => {
    resetForm();
    setEditingProduct(null);
    setViewMode('form');
  };

  // Open edit form
  const openEditForm = (product: DigitalProduct) => {
    setFormData({
      service_name: product.service_name || '',
      original_price: product.original_price?.toString() || '',
      resell_price: product.resell_price?.toString() || '',
      sale_date: product.sale_date || new Date().toISOString().split('T')[0],
      payment_method: product.payment_method || '',
      customer_name: product.customer_name || '',
      customer_phone: product.customer_phone || '',
      customer_email: product.customer_email || '',
      notes: product.notes || '',
    });
    setEditingProduct(product);
    setViewMode('form');
  };

  // Go back to list
  const goBack = () => {
    setViewMode('list');
    setEditingProduct(null);
    resetForm();
  };

  // Handle form change
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate profit
  const calculateProfit = () => {
    const resell = parseFloat(formData.resell_price) || 0;
    const original = parseFloat(formData.original_price) || 0;
    return resell - original;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.service_name.trim()) {
      toast.error('Service name is required');
      return;
    }
    if (!formData.original_price || !formData.resell_price) {
      toast.error('Both prices are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        service_name: formData.service_name.trim(),
        original_price: parseFloat(formData.original_price) || 0,
        resell_price: parseFloat(formData.resell_price) || 0,
        sale_date: formData.sale_date || new Date().toISOString().split('T')[0],
        payment_method: formData.payment_method.trim() || null,
        customer_name: formData.customer_name.trim() || null,
        customer_phone: formData.customer_phone.trim() || null,
        customer_email: formData.customer_email.trim() || null,
        notes: formData.notes.trim() || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('digital_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('digital_products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product added successfully');
      }

      goBack();
      fetchProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!deleteProductId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('digital_products')
        .delete()
        .eq('id', deleteProductId);

      if (error) throw error;
      
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteProductId(null);
      setDeleteProductName('');
    }
  };

  const confirmDelete = (product: DigitalProduct) => {
    setDeleteProductId(product.id);
    setDeleteProductName(product.service_name);
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
    setDeleteProductName('');
  };

  // Filter products
  const filteredProducts = products.filter(product => 
    product.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.customer_phone?.includes(searchQuery))
  );

  // Calculate totals
  const totalRevenue = products.reduce((sum, p) => sum + (p.resell_price || 0), 0);
  const totalProfit = products.reduce((sum, p) => sum + (p.profit || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.original_price || 0), 0);

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // FORM VIEW
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">
            {editingProduct ? 'Edit Digital Product' : 'Add Digital Product'}
          </h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="service_name">Service/Product Name *</Label>
                  <Input
                    id="service_name"
                    value={formData.service_name}
                    onChange={(e) => handleChange('service_name', e.target.value)}
                    placeholder="e.g., Canva Pro, ChatGPT Plus, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (₹) *</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handleChange('original_price', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resell_price">Resell Price (₹) *</Label>
                  <Input
                    id="resell_price"
                    type="number"
                    value={formData.resell_price}
                    onChange={(e) => handleChange('resell_price', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit (₹)</Label>
                  <Input
                    value={calculateProfit().toLocaleString('en-IN')}
                    disabled
                    className={`bg-muted ${calculateProfit() >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_date">Sale Date</Label>
                  <Input
                    id="sale_date"
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => handleChange('sale_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e.target.value)}
                    placeholder="e.g., UPI, Bank Transfer, Cash"
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Customer Information (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Customer Phone</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customer_email">Customer Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleChange('customer_email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      {/* Delete Confirmation Inline */}
      {deleteProductId && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Delete "{deleteProductName}"?</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cancelDelete} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(totalCost)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Original</TableHead>
                  <TableHead className="text-right">Resell</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      {searchQuery ? 'No products found matching your search.' : 'No digital products yet. Add your first sale!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.service_name}</p>
                          {product.payment_method && (
                            <p className="text-sm text-muted-foreground">{product.payment_method}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.customer_name || '—'}</p>
                          {product.customer_phone && (
                            <p className="text-sm text-muted-foreground">{product.customer_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.original_price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(product.resell_price)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${product.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(product.profit)}
                      </TableCell>
                      <TableCell>
                        {formatDate(product.sale_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => confirmDelete(product)}
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
    </div>
  );
};

export default DigitalProductManager;
