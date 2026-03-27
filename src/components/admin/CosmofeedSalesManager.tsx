import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import { CalendarIcon, Plus, Trash2, ShoppingBag, TrendingUp, Filter, X, Pencil, Check } from 'lucide-react';

interface CosmofeedSale {
  id: string;
  product_title: string;
  price: number;
  gst_amount: number;
  net_amount: number;
  quantity: number;
  sale_date: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

type TimePeriod = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';

const CosmofeedSalesManager = () => {
  const [sales, setSales] = useState<CosmofeedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    product_title: '',
    price: '',
    gst_amount: '',
    quantity: '1',
    sale_date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: '',
    notes: '',
  });

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('cosmofeed_sales').select('*').order('sale_date', { ascending: false });
    if (error) {
      toast.error('Failed to fetch sales');
    } else {
      setSales(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
    const channel = supabase.channel('cosmofeed-sales-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cosmofeed_sales' }, () => fetchSales())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price) || 0;
    const gst = parseFloat(formData.gst_amount) || 0;
    const qty = parseInt(formData.quantity) || 1;
    const netAmount = (price - gst) * qty;

    const payload = {
      product_title: formData.product_title,
      price,
      gst_amount: gst,
      net_amount: netAmount,
      quantity: qty,
      sale_date: formData.sale_date,
      payment_method: formData.payment_method || null,
      notes: formData.notes || null,
    };

    let error;
    if (editingId) {
      ({ error } = await (supabase as any).from('cosmofeed_sales').update(payload).eq('id', editingId));
    } else {
      ({ error } = await (supabase as any).from('cosmofeed_sales').insert(payload));
    }

    if (error) {
      toast.error('Failed to save sale');
    } else {
      toast.success(editingId ? 'Sale updated!' : 'Sale added!');
      resetForm();
      fetchSales();
    }
  };

  const resetForm = () => {
    setFormData({ product_title: '', price: '', gst_amount: '', quantity: '1', sale_date: format(new Date(), 'yyyy-MM-dd'), payment_method: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (sale: CosmofeedSale) => {
    setFormData({
      product_title: sale.product_title,
      price: sale.price.toString(),
      gst_amount: sale.gst_amount.toString(),
      quantity: sale.quantity.toString(),
      sale_date: sale.sale_date,
      payment_method: sale.payment_method || '',
      notes: sale.notes || '',
    });
    setEditingId(sale.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any).from('cosmofeed_sales').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Sale deleted'); fetchSales(); }
  };

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
      filtered = filtered.filter(s => {
        const d = new Date(s.sale_date);
        return isWithinInterval(d, { start: range.start, end: range.end });
      });
    }
    if (searchQuery) {
      filtered = filtered.filter(s => s.product_title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [sales, timePeriod, customFrom, customTo, searchQuery]);

  const periodStats = useMemo(() => {
    const calc = (period: TimePeriod) => {
      const range = getDateRange(period);
      if (!range) return { totalSales: sales.length, totalRevenue: sales.reduce((s, x) => s + x.net_amount, 0), totalGST: sales.reduce((s, x) => s + x.gst_amount * x.quantity, 0) };
      const f = sales.filter(s => isWithinInterval(new Date(s.sale_date), { start: range.start, end: range.end }));
      return { totalSales: f.length, totalRevenue: f.reduce((s, x) => s + x.net_amount, 0), totalGST: f.reduce((s, x) => s + x.gst_amount * x.quantity, 0) };
    };
    return {
      today: calc('today'),
      yesterday: calc('yesterday'),
      week: calc('week'),
      month: calc('month'),
      year: calc('year'),
    };
  }, [sales]);

  const currentStats = useMemo(() => {
    return {
      totalSales: filteredSales.length,
      totalRevenue: filteredSales.reduce((s, x) => s + x.net_amount, 0),
      totalGST: filteredSales.reduce((s, x) => s + x.gst_amount * x.quantity, 0),
      totalGross: filteredSales.reduce((s, x) => s + x.price * x.quantity, 0),
    };
  }, [filteredSales]);

  const formatINR = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const periodCards = [
    { label: 'Today', key: 'today' as TimePeriod, color: 'from-emerald-500 to-green-500' },
    { label: 'Yesterday', key: 'yesterday' as TimePeriod, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Week', key: 'week' as TimePeriod, color: 'from-purple-500 to-violet-500' },
    { label: 'This Month', key: 'month' as TimePeriod, color: 'from-orange-500 to-amber-500' },
    { label: 'This Year', key: 'year' as TimePeriod, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Period Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {periodCards.map(p => {
          const stats = periodStats[p.key as keyof typeof periodStats];
          return (
            <Card
              key={p.key}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105",
                timePeriod === p.key ? "ring-2 ring-primary shadow-lg" : ""
              )}
              onClick={() => setTimePeriod(timePeriod === p.key ? 'all' : p.key)}
            >
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="text-lg font-bold">{formatINR(stats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">{stats.totalSales} sales</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Date Range & Filters */}
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
              <Calendar mode="single" selected={customFrom} onSelect={(d) => { setCustomFrom(d); setTimePeriod('custom'); }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">To</p>
              <Calendar mode="single" selected={customTo} onSelect={(d) => { setCustomTo(d); setTimePeriod('custom'); }} />
            </div>
          </PopoverContent>
        </Popover>

        <Input placeholder="Search product..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48" />

        {timePeriod !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setTimePeriod('all')}>
            <X className="h-3 w-3 mr-1" /> Clear Filter
          </Button>
        )}

        <div className="ml-auto">
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Sale
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Sales</p>
            <p className="text-xl font-bold">{currentStats.totalSales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Gross Revenue</p>
            <p className="text-xl font-bold text-emerald-600">{formatINR(currentStats.totalGross)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">GST Collected</p>
            <p className="text-xl font-bold text-amber-600">{formatINR(currentStats.totalGST)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Net Revenue</p>
            <p className="text-xl font-bold text-primary">{formatINR(currentStats.totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">{editingId ? 'Edit Sale' : 'Add New Sale'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="Product/Service Title *" value={formData.product_title} onChange={e => setFormData(p => ({ ...p, product_title: e.target.value }))} required />
              <Input type="number" placeholder="Price (₹) *" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
              <Input type="number" placeholder="GST Amount (₹)" value={formData.gst_amount} onChange={e => setFormData(p => ({ ...p, gst_amount: e.target.value }))} />
              <Input type="number" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: e.target.value }))} min="1" />
              <Input type="date" value={formData.sale_date} onChange={e => setFormData(p => ({ ...p, sale_date: e.target.value }))} />
              <Input placeholder="Payment Method" value={formData.payment_method} onChange={e => setFormData(p => ({ ...p, payment_method: e.target.value }))} />
              <Input placeholder="Notes" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  <Check className="h-4 w-4 mr-1" /> {editingId ? 'Update' : 'Save'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Cosmofeed Sales ({filteredSales.length})
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
                      {sale.quantity > 1 && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">x{sale.quantity}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{format(new Date(sale.sale_date), 'dd MMM yyyy')}</span>
                      <span>Price: {formatINR(sale.price)}</span>
                      {sale.gst_amount > 0 && <span>GST: {formatINR(sale.gst_amount)}</span>}
                      {sale.payment_method && <span>{sale.payment_method}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="font-bold text-emerald-600 whitespace-nowrap">{formatINR(sale.net_amount)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(sale)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(sale.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CosmofeedSalesManager;
