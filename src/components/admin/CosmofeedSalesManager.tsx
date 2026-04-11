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
import { CalendarIcon, Plus, Trash2, ShoppingBag, Pencil, Check, X, Package, TrendingUp, BarChart3, ArrowUpDown, PieChart } from 'lucide-react';

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

interface AdSpendEntry {
  amount: number;
  spend_date: string;
  title: string;
}

const CosmofeedSalesManager = () => {
  const [products, setProducts] = useState<CosmofeedProduct[]>([]);
  const [sales, setSales] = useState<CosmofeedSale[]>([]);
  const [adSpends, setAdSpends] = useState<AdSpendEntry[]>([]);
  const [analyticsProduct, setAnalyticsProduct] = useState<string>('all');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<TimePeriod>('all');
  const [analyticsCustomFrom, setAnalyticsCustomFrom] = useState<Date | undefined>();
  const [analyticsCustomTo, setAnalyticsCustomTo] = useState<Date | undefined>();
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
    const [prodRes, salesRes, adSpendRes] = await Promise.all([
      (supabase as any).from('cosmofeed_products').select('*').order('product_title'),
      (supabase as any).from('cosmofeed_sales').select('*').order('sale_date', { ascending: false }),
      (supabase as any).from('spends').select('amount, spend_date, title').eq('category', 'ad spend'),
    ]);
    setProducts(prodRes.data || []);
    setSales(salesRes.data || []);
    setAdSpends(adSpendRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Poll for updates every 30 seconds (realtime removed for security)
    const interval = setInterval(() => { fetchData(); }, 30000);
    return () => { clearInterval(interval); };
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

  // Ad Spend vs Cosmofeed Profit comparison
  const comparisonStats = useMemo(() => {
    const periods: { label: string; key: TimePeriod }[] = [
      { label: 'Today', key: 'today' },
      { label: 'Yesterday', key: 'yesterday' },
      { label: 'This Week', key: 'week' },
      { label: 'This Month', key: 'month' },
      { label: 'This Year', key: 'year' },
      { label: 'All Time', key: 'all' },
    ];
    return periods.map(p => {
      const range = getDateRange(p.key);
      let periodSales = sales;
      let periodAds = adSpends;
      if (range) {
        periodSales = sales.filter(s => isWithinInterval(new Date(s.sale_date), { start: range.start, end: range.end }));
        periodAds = adSpends.filter(a => isWithinInterval(new Date(a.spend_date), { start: range.start, end: range.end }));
      }
      const revenue = periodSales.reduce((s, x) => s + x.net_amount, 0);
      const adTotal = periodAds.reduce((s, x) => s + x.amount, 0);
      const profit = revenue - adTotal;
      const roas = adTotal > 0 ? revenue / adTotal : 0;
      return { ...p, revenue, adTotal, profit, roas };
    });
  }, [sales, adSpends]);

  const periodCards = [
    { label: 'Today', key: 'today' as TimePeriod, color: 'from-emerald-500 to-green-500' },
    { label: 'Yesterday', key: 'yesterday' as TimePeriod, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Week', key: 'week' as TimePeriod, color: 'from-purple-500 to-violet-500' },
    { label: 'This Month', key: 'month' as TimePeriod, color: 'from-orange-500 to-amber-500' },
    { label: 'This Year', key: 'year' as TimePeriod, color: 'from-pink-500 to-rose-500' },
  ];

  // Product-wise Analytics
  const productAnalytics = useMemo(() => {
    const getAnalyticsRange = () => {
      if (analyticsPeriod === 'custom') {
        return { start: analyticsCustomFrom || new Date(), end: analyticsCustomTo || new Date() };
      }
      return getDateRange(analyticsPeriod);
    };
    const range = getAnalyticsRange();

    // Match ad spends to products by title pattern "Ad Spend - <product_title>"
    const productMap: Record<string, { product_title: string; adSpend: number; revenue: number; salesCount: number; gst: number }> = {};

    // Initialize with all products
    products.forEach(p => {
      productMap[p.id] = { product_title: p.product_title, adSpend: 0, revenue: 0, salesCount: 0, gst: 0 };
    });
    // Add "Other" bucket
    productMap['other'] = { product_title: 'Other', adSpend: 0, revenue: 0, salesCount: 0, gst: 0 };

    // Filter and assign sales
    let filtSales = sales;
    if (range) filtSales = sales.filter(s => isWithinInterval(new Date(s.sale_date), { start: range.start, end: range.end }));
    
    filtSales.forEach(s => {
      const key = s.product_id && productMap[s.product_id] ? s.product_id : 'other';
      productMap[key].revenue += s.net_amount;
      productMap[key].salesCount += s.quantity;
      productMap[key].gst += s.gst_amount * s.quantity;
    });

    // Filter and assign ad spends
    let filtAds = adSpends;
    if (range) filtAds = adSpends.filter(a => isWithinInterval(new Date(a.spend_date), { start: range.start, end: range.end }));

    filtAds.forEach(a => {
      // Title format: "Ad Spend - <product_title>" or custom
      const titleMatch = a.title.replace(/^Ad Spend\s*-\s*/, '').trim();
      const matchedProduct = products.find(p => p.product_title.toLowerCase() === titleMatch.toLowerCase());
      if (matchedProduct && productMap[matchedProduct.id]) {
        productMap[matchedProduct.id].adSpend += a.amount;
      } else {
        productMap['other'].adSpend += a.amount;
      }
    });

    // Filter by selected product
    let entries = Object.entries(productMap).map(([id, data]) => ({ id, ...data, profit: data.revenue - data.adSpend, roas: data.adSpend > 0 ? data.revenue / data.adSpend : 0 }));
    
    if (analyticsProduct !== 'all') {
      entries = entries.filter(e => e.id === analyticsProduct);
    }

    // Remove empty entries when showing all
    if (analyticsProduct === 'all') {
      entries = entries.filter(e => e.adSpend > 0 || e.revenue > 0);
    }

    const totals = entries.reduce((acc, e) => ({
      adSpend: acc.adSpend + e.adSpend,
      revenue: acc.revenue + e.revenue,
      profit: acc.profit + e.profit,
      salesCount: acc.salesCount + e.salesCount,
      gst: acc.gst + e.gst,
    }), { adSpend: 0, revenue: 0, profit: 0, salesCount: 0, gst: 0 });

    return { entries, totals, totalRoas: totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0 };
  }, [sales, adSpends, products, analyticsProduct, analyticsPeriod, analyticsCustomFrom, analyticsCustomTo]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="sales" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <PieChart className="h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" /> Compare
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
        </TabsList>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Product-wise Ad Spend Analytics</h3>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[200px]">
              <Select value={analyticsProduct} onValueChange={setAnalyticsProduct}>
                <SelectTrigger><SelectValue placeholder="All Products" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.product_title}</SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'today', 'yesterday', 'week', 'month', 'year'] as TimePeriod[]).map(p => (
                <Button key={p} variant={analyticsPeriod === p ? 'default' : 'outline'} size="sm" onClick={() => setAnalyticsPeriod(p)} className="capitalize text-xs">
                  {p === 'all' ? 'All Time' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : p}
                </Button>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={analyticsPeriod === 'custom' ? 'default' : 'outline'} size="sm" className="text-xs">
                    <CalendarIcon className="h-3 w-3 mr-1" /> Custom
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 space-y-3" align="start">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">From</p>
                    <Calendar mode="single" selected={analyticsCustomFrom} onSelect={d => { setAnalyticsCustomFrom(d); setAnalyticsPeriod('custom'); }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To</p>
                    <Calendar mode="single" selected={analyticsCustomTo} onSelect={d => { setAnalyticsCustomTo(d); setAnalyticsPeriod('custom'); }} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card className="border-0 bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg">
              <CardContent className="p-3">
                <p className="text-xs opacity-80">Ad Spend</p>
                <p className="text-xl font-bold">{fmt(productAnalytics.totals.adSpend)}</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
              <CardContent className="p-3">
                <p className="text-xs opacity-80">Revenue</p>
                <p className="text-xl font-bold">{fmt(productAnalytics.totals.revenue)}</p>
              </CardContent>
            </Card>
            <Card className={cn("border-0 text-white shadow-lg", productAnalytics.totals.profit >= 0 ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-red-600 to-rose-700")}>
              <CardContent className="p-3">
                <p className="text-xs opacity-80">Net Profit</p>
                <p className="text-xl font-bold">{productAnalytics.totals.profit >= 0 ? '+' : ''}{fmt(productAnalytics.totals.profit)}</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
              <CardContent className="p-3">
                <p className="text-xs opacity-80">ROAS</p>
                <p className="text-xl font-bold">{productAnalytics.totalRoas > 0 ? `${productAnalytics.totalRoas.toFixed(2)}x` : '—'}</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <CardContent className="p-3">
                <p className="text-xs opacity-80">Sales</p>
                <p className="text-xl font-bold">{productAnalytics.totals.salesCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Product-wise Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product-wise Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {productAnalytics.entries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No data for this filter</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Product</th>
                        <th className="text-right py-2 px-3 font-medium">Ad Spend</th>
                        <th className="text-right py-2 px-3 font-medium">Revenue</th>
                        <th className="text-right py-2 px-3 font-medium">GST</th>
                        <th className="text-right py-2 px-3 font-medium">Profit</th>
                        <th className="text-right py-2 px-3 font-medium">ROAS</th>
                        <th className="text-right py-2 px-3 font-medium">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productAnalytics.entries.map(e => (
                        <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-2 px-3 font-medium">{e.product_title}</td>
                          <td className="py-2 px-3 text-right text-destructive">{fmt(e.adSpend)}</td>
                          <td className="py-2 px-3 text-right text-primary">{fmt(e.revenue)}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{fmt(e.gst)}</td>
                          <td className={cn("py-2 px-3 text-right font-semibold", e.profit >= 0 ? "text-primary" : "text-destructive")}>
                            {e.profit >= 0 ? '+' : ''}{fmt(e.profit)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {e.adSpend > 0 ? <span className={cn("font-semibold", e.roas >= 1 ? "text-primary" : "text-destructive")}>{e.roas.toFixed(2)}x</span> : '—'}
                          </td>
                          <td className="py-2 px-3 text-right">{e.salesCount}</td>
                        </tr>
                      ))}
                      {productAnalytics.entries.length > 1 && (
                        <tr className="bg-muted/50 font-semibold">
                          <td className="py-2 px-3">Total</td>
                          <td className="py-2 px-3 text-right text-destructive">{fmt(productAnalytics.totals.adSpend)}</td>
                          <td className="py-2 px-3 text-right text-primary">{fmt(productAnalytics.totals.revenue)}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{fmt(productAnalytics.totals.gst)}</td>
                          <td className={cn("py-2 px-3 text-right", productAnalytics.totals.profit >= 0 ? "text-primary" : "text-destructive")}>
                            {productAnalytics.totals.profit >= 0 ? '+' : ''}{fmt(productAnalytics.totals.profit)}
                          </td>
                          <td className="py-2 px-3 text-right">{productAnalytics.totalRoas > 0 ? `${productAnalytics.totalRoas.toFixed(2)}x` : '—'}</td>
                          <td className="py-2 px-3 text-right">{productAnalytics.totals.salesCount}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== COMPARE TAB ===== */}
        <TabsContent value="compare" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Ad Spend vs Cosmofeed Profit</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonStats.map(stat => {
              const isProfitable = stat.profit >= 0;
              return (
                <Card key={stat.key} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Cosmofeed Revenue</span>
                      <span className="font-semibold text-primary">{fmt(stat.revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Ad Spend</span>
                      <span className="font-semibold text-destructive">{fmt(stat.adTotal)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Net Profit</span>
                        <span className={cn("font-bold text-lg", isProfitable ? "text-primary" : "text-destructive")}>
                          {isProfitable ? '+' : ''}{fmt(stat.profit)}
                        </span>
                      </div>
                    </div>
                    {stat.adTotal > 0 && (
                      <div className="flex justify-between items-center bg-muted/50 rounded-md px-2 py-1">
                        <span className="text-xs text-muted-foreground">ROAS</span>
                        <span className={cn("text-sm font-semibold", stat.roas >= 1 ? "text-primary" : "text-destructive")}>
                          {stat.roas.toFixed(2)}x
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Period-wise Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Period</th>
                      <th className="text-right py-2 px-3 font-medium">Revenue</th>
                      <th className="text-right py-2 px-3 font-medium">Ad Spend</th>
                      <th className="text-right py-2 px-3 font-medium">Profit</th>
                      <th className="text-right py-2 px-3 font-medium">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonStats.map(stat => (
                      <tr key={stat.key} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{stat.label}</td>
                        <td className="py-2 px-3 text-right text-primary">{fmt(stat.revenue)}</td>
                        <td className="py-2 px-3 text-right text-destructive">{fmt(stat.adTotal)}</td>
                        <td className={cn("py-2 px-3 text-right font-semibold", stat.profit >= 0 ? "text-primary" : "text-destructive")}>
                          {stat.profit >= 0 ? '+' : ''}{fmt(stat.profit)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {stat.adTotal > 0 ? `${stat.roas.toFixed(2)}x` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
