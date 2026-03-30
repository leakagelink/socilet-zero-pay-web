import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import { CalendarIcon, Plus, Trash2, ShoppingBag, Pencil, Check, X, Package, TrendingUp, BarChart3, ArrowUpDown } from 'lucide-react';

interface CosmofeedProduct {
  id: string;
  product_title: string;
  price: number;
  gst_amount: number;
  is_active: boolean;
}

interface CosmofeedSale {
  id: string;
  product_id: string | null;
  product_title: string;
  price: number;
  gst_amount: number;
  net_amount: number;
  quantity: number;
  sale_date: string;
  payment_method: string | null;
  notes: string | null;
}

type TimePeriod = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';

const CosmofeedSalesManager = () => {
  const [products, setProducts] = useState<CosmofeedProduct[]>([]);
  const [sales, setSales] = useState<CosmofeedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ product_title: '', price: '', gst_amount: '' });

  // Sale form
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [saleForm, setSaleForm] = useState({ quantity: '1', sale_date: format(new Date(), 'yyyy-MM-dd'), payment_method: '', notes: '' });

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, salesRes] = await Promise.all([
      (supabase as any).from('cosmofeed_products').select('*').order('product_title'),
      (supabase as any).from('cosmofeed_sales').select('*').order('sale_date', { ascending: false }),
    ]);
    setProducts(prodRes.data || []);
    setSales(salesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const ch1 = supabase.channel('cf-products').on('postgres_changes', { event: '*', schema: 'public', table: 'cosmofeed_products' }, () => fetchData()).subscribe();
    const ch2 = supabase.channel('cf-sales').on('postgres_changes', { event: '*', schema: 'public', table: 'cosmofeed_sales' }, () => fetchData()).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); };
  }, []);

  // ---- Product CRUD ----
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      product_title: productForm.product_title,
      price: parseFloat(productForm.price) || 0,
      gst_amount: parseFloat(productForm.gst_amount) || 0,
    };
    let error;
    if (editingProductId) {
      ({ error } = await (supabase as any).from('cosmofeed_products').update(payload).eq('id', editingProductId));
    } else {
      ({ error } = await (supabase as any).from('cosmofeed_products').insert(payload));
    }
    if (error) toast.error('Failed to save product');
    else { toast.success(editingProductId ? 'Product updated!' : 'Product added!'); resetProductForm(); }
  };

  const resetProductForm = () => {
    setProductForm({ product_title: '', price: '', gst_amount: '' });
    setShowProductForm(false);
    setEditingProductId(null);
  };

  const editProduct = (p: CosmofeedProduct) => {
    setProductForm({ product_title: p.product_title, price: p.price.toString(), gst_amount: p.gst_amount.toString() });
    setEditingProductId(p.id);
    setShowProductForm(true);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await (supabase as any).from('cosmofeed_products').delete().eq('id', id);
    if (error) toast.error('Failed to delete'); else toast.success('Product deleted');
  };

  // ---- Sale CRUD (quick add) ----
  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) { toast.error('Please select a product'); return; }

    const qty = parseInt(saleForm.quantity) || 1;
    const netAmount = (product.price - product.gst_amount) * qty;

    const payload = {
      product_id: product.id,
      product_title: product.product_title,
      price: product.price,
      gst_amount: product.gst_amount,
      net_amount: netAmount,
      quantity: qty,
      sale_date: saleForm.sale_date,
      payment_method: saleForm.payment_method || null,
      notes: saleForm.notes || null,
    };

    const { error } = await (supabase as any).from('cosmofeed_sales').insert(payload);
    if (error) toast.error('Failed to add sale');
    else { toast.success('Sale recorded!'); resetSaleForm(); }
  };

  const resetSaleForm = () => {
    setSaleForm({ quantity: '1', sale_date: format(new Date(), 'yyyy-MM-dd'), payment_method: '', notes: '' });
    setSelectedProductId('');
    setShowSaleForm(false);
  };

  const deleteSale = async (id: string) => {
    const { error } = await (supabase as any).from('cosmofeed_sales').delete().eq('id', id);
    if (error) toast.error('Failed to delete'); else toast.success('Sale deleted');
  };

  // ---- Filtering ----
  const getDateRange = (period: TimePeriod) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (period) {
      case 'today': return { start: today, end: now };
      case 'yesterday': return { start: subDays(today, 1), end: today };
      case 'week': return { start: startOfWeek(today, { weekStartsOn: 1 }), end: now };
      case 'month': return { start: startOfMonth(today), end: now };
      case 'year': return { start: startOfYear(today), end: now };
      case 'custom': return { start: customFrom || today, end: customTo || now };
      default: return null;
    }
  };

  const filteredSales = useMemo(() => {
    let filtered = sales;
    const range = getDateRange(timePeriod);
    if (range) {
      filtered = filtered.filter(s => isWithinInterval(new Date(s.sale_date), { start: range.start, end: range.end }));
    }
    if (searchQuery) {
      filtered = filtered.filter(s => s.product_title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [sales, timePeriod, customFrom, customTo, searchQuery]);

  const periodStats = useMemo(() => {
    const calc = (period: TimePeriod) => {
      const range = getDateRange(period);
      if (!range) return { count: sales.length, revenue: sales.reduce((s, x) => s + x.net_amount, 0) };
      const f = sales.filter(s => isWithinInterval(new Date(s.sale_date), { start: range.start, end: range.end }));
      return { count: f.length, revenue: f.reduce((s, x) => s + x.net_amount, 0) };
    };
    return { today: calc('today'), yesterday: calc('yesterday'), week: calc('week'), month: calc('month'), year: calc('year') };
  }, [sales]);

  const currentStats = useMemo(() => ({
    totalSales: filteredSales.length,
    totalGross: filteredSales.reduce((s, x) => s + x.price * x.quantity, 0),
    totalGST: filteredSales.reduce((s, x) => s + x.gst_amount * x.quantity, 0),
    totalNet: filteredSales.reduce((s, x) => s + x.net_amount, 0),
  }), [filteredSales]);

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const activeProducts = products.filter(p => p.is_active);

  const periodCards = [
    { label: 'Today', key: 'today' as TimePeriod, color: 'from-emerald-500 to-green-500' },
    { label: 'Yesterday', key: 'yesterday' as TimePeriod, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Week', key: 'week' as TimePeriod, color: 'from-purple-500 to-violet-500' },
    { label: 'This Month', key: 'month' as TimePeriod, color: 'from-orange-500 to-amber-500' },
    { label: 'This Year', key: 'year' as TimePeriod, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="sales" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
        </TabsList>

        {/* ===== PRODUCTS TAB ===== */}
        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product / Service Catalog</h3>
            <Button size="sm" onClick={() => { resetProductForm(); setShowProductForm(!showProductForm); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>

          {showProductForm && (
            <Card>
              <CardContent className="pt-4">
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Input placeholder="Product/Service Title *" value={productForm.product_title} onChange={e => setProductForm(p => ({ ...p, product_title: e.target.value }))} required />
                  <Input type="number" placeholder="Price (₹) *" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} required />
                  <Input type="number" placeholder="GST Amount (₹)" value={productForm.gst_amount} onChange={e => setProductForm(p => ({ ...p, gst_amount: e.target.value }))} />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1">
                      <Check className="h-4 w-4 mr-1" /> {editingProductId ? 'Update' : 'Save'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetProductForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products added yet. Add your first product above.</p>
            ) : products.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{p.product_title}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>Price: {fmt(p.price)}</span>
                    <span>GST: {fmt(p.gst_amount)}</span>
                    <span>Net: {fmt(p.price - p.gst_amount)}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editProduct(p)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteProduct(p.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ===== SALES TAB ===== */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          {/* Period Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {periodCards.map(pc => {
              const s = periodStats[pc.key as keyof typeof periodStats];
              return (
                <Card
                  key={pc.key}
                  className={cn("cursor-pointer transition-all duration-200 hover:scale-105", timePeriod === pc.key ? "ring-2 ring-primary shadow-lg" : "")}
                  onClick={() => setTimePeriod(timePeriod === pc.key ? 'all' : pc.key)}
                >
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">{pc.label}</p>
                    <p className="text-lg font-bold">{fmt(s.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{s.count} sales</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Add Sale + Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn(timePeriod === 'custom' && "ring-2 ring-primary")}>
                  <CalendarIcon className="h-4 w-4 mr-1" /> Custom Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 space-y-3" align="start">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">From</p>
                  <Calendar mode="single" selected={customFrom} onSelect={d => { setCustomFrom(d); setTimePeriod('custom'); }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">To</p>
                  <Calendar mode="single" selected={customTo} onSelect={d => { setCustomTo(d); setTimePeriod('custom'); }} />
                </div>
              </PopoverContent>
            </Popover>

            <Input placeholder="Search product..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48" />

            {timePeriod !== 'all' && (
              <Button variant="ghost" size="sm" onClick={() => setTimePeriod('all')}>
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}

            <div className="ml-auto">
              <Button onClick={() => { resetSaleForm(); setShowSaleForm(!showSaleForm); }} size="sm" disabled={activeProducts.length === 0}>
                <Plus className="h-4 w-4 mr-1" /> Record Sale
              </Button>
            </div>
          </div>

          {/* Quick Sale Form */}
          {showSaleForm && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Record New Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div className="lg:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Select Product *</label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeProducts.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.product_title} — {fmt(p.price)} (GST: {fmt(p.gst_amount)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                    <Input type="number" value={saleForm.quantity} onChange={e => setSaleForm(p => ({ ...p, quantity: e.target.value }))} min="1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sale Date</label>
                    <Input type="date" value={saleForm.sale_date} onChange={e => setSaleForm(p => ({ ...p, sale_date: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1">
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetSaleForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
                {selectedProductId && (() => {
                  const p = products.find(x => x.id === selectedProductId);
                  const qty = parseInt(saleForm.quantity) || 1;
                  if (!p) return null;
                  return (
                    <div className="mt-3 p-2 rounded-md bg-muted text-xs flex gap-4">
                      <span>Price: {fmt(p.price * qty)}</span>
                      <span>GST: {fmt(p.gst_amount * qty)}</span>
                      <span className="font-semibold">Net: {fmt((p.price - p.gst_amount) * qty)}</span>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {activeProducts.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Pehle "Products" tab mein apne products add karo, phir yahan se sale record kar sakte ho.</p>
              </CardContent>
            </Card>
          )}

          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card><CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Total Sales</p>
              <p className="text-xl font-bold">{currentStats.totalSales}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Gross Revenue</p>
              <p className="text-xl font-bold text-emerald-600">{fmt(currentStats.totalGross)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3">
              <p className="text-xs text-muted-foreground">GST Collected</p>
              <p className="text-xl font-bold text-amber-600">{fmt(currentStats.totalGST)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Net Revenue</p>
              <p className="text-xl font-bold text-primary">{fmt(currentStats.totalNet)}</p>
            </CardContent></Card>
          </div>

          {/* Sales List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Sales ({filteredSales.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : filteredSales.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No sales found</p>
              ) : (
                <div className="space-y-2">
                  {filteredSales.map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium truncate">{sale.product_title}</p>
                          {sale.quantity > 1 && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">x{sale.quantity}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{format(new Date(sale.sale_date), 'dd MMM yyyy')}</span>
                          <span>Price: {fmt(sale.price)}</span>
                          {sale.gst_amount > 0 && <span>GST: {fmt(sale.gst_amount)}</span>}
                          {sale.payment_method && <span>{sale.payment_method}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="font-bold text-emerald-600 whitespace-nowrap">{fmt(sale.net_amount)}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSale(sale.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CosmofeedSalesManager;
