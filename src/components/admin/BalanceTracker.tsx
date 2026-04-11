import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval, isToday, isYesterday } from 'date-fns';
import { CalendarIcon, Landmark, FolderKanban, Package, RefreshCw, Wallet, TrendingDown, TrendingUp, Filter, X, ShoppingBag } from 'lucide-react';

interface BalanceEntry {
  amount: number;
  date: string;
  source: 'projects' | 'recurring' | 'digital_products' | 'other_income' | 'spends' | 'cosmofeed';
  description: string;
}

type TimePeriod = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';

const BalanceTracker = () => {
  const [entries, setEntries] = useState<BalanceEntry[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchAllEntries = async () => {
    setLoading(true);
    try {
      const [projectsRes, digitalRes, otherRes, spendsRes, recurringRes, cosmofeedRes] = await Promise.all([
        supabase.from('projects').select('advance_amount, created_at, client_name, project_name'),
        supabase.from('digital_products').select('resell_price, sale_date, service_name, customer_name'),
        supabase.from('other_income').select('amount, paid_amount, payment_date, client_name, work_description, status'),
        supabase.from('spends').select('amount, spend_date, title, category'),
        supabase.from('recurring_earnings').select('amount, start_date, client_name, project_name, is_active'),
        (supabase as any).from('cosmofeed_sales').select('net_amount, sale_date, product_title, quantity'),
      ]);

      const allEntries: BalanceEntry[] = [];

      // Projects - advance received
      projectsRes.data?.forEach(p => {
        if (p.advance_amount && p.advance_amount > 0) {
          allEntries.push({
            amount: p.advance_amount,
            date: p.created_at,
            source: 'projects',
            description: `${p.project_name} - ${p.client_name}`,
          });
        }
      });

      // Digital products
      digitalRes.data?.forEach(d => {
        if (d.resell_price > 0) {
          allEntries.push({
            amount: d.resell_price,
            date: d.sale_date,
            source: 'digital_products',
            description: `${d.service_name}${d.customer_name ? ' - ' + d.customer_name : ''}`,
          });
        }
      });

      // Other income
      otherRes.data?.forEach(o => {
        const amt = o.status === 'paid' ? o.amount : o.status === 'partial' ? (o.paid_amount || 0) : 0;
        if (amt > 0) {
          allEntries.push({
            amount: amt,
            date: o.payment_date,
            source: 'other_income',
            description: `${o.work_description} - ${o.client_name}`,
          });
        }
      });

      // Recurring earnings (active)
      recurringRes.data?.forEach(r => {
        if (r.is_active && r.amount > 0) {
          allEntries.push({
            amount: r.amount,
            date: r.start_date,
            source: 'recurring',
            description: `${r.project_name} - ${r.client_name}`,
          });
        }
      });

      // Cosmofeed sales
      (cosmofeedRes.data as any[])?.forEach((c: any) => {
        if (c.net_amount > 0) {
          allEntries.push({
            amount: c.net_amount,
            date: c.sale_date,
            source: 'cosmofeed',
            description: `${c.product_title}${c.quantity > 1 ? ' x' + c.quantity : ''}`,
          });
        }
      });

      // Spends (negative)
      spendsRes.data?.forEach(s => {
        if (s.amount > 0) {
          allEntries.push({
            amount: -s.amount,
            date: s.spend_date,
            source: 'spends',
            description: `${s.title} (${s.category})`,
          });
        }
      });

      setEntries(allEntries);
    } catch (err) {
      console.error('Error fetching balance entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();

    // Poll for updates every 30 seconds (realtime removed for security)
    const interval = setInterval(() => {
      fetchAllEntries();
    }, 30000);

    return () => { clearInterval(interval); };
  }, []);

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

  const filteredEntries = useMemo(() => {
    const range = getDateRange(timePeriod);
    if (!range) return entries;
    return entries.filter(e => {
      const d = new Date(e.date);
      return isWithinInterval(d, { start: range.start, end: range.end });
    });
  }, [entries, timePeriod, customFrom, customTo]);

  const stats = useMemo(() => {
    const projects = filteredEntries.filter(e => e.source === 'projects').reduce((s, e) => s + e.amount, 0);
    const recurring = filteredEntries.filter(e => e.source === 'recurring').reduce((s, e) => s + e.amount, 0);
    const digital = filteredEntries.filter(e => e.source === 'digital_products').reduce((s, e) => s + e.amount, 0);
    const other = filteredEntries.filter(e => e.source === 'other_income').reduce((s, e) => s + e.amount, 0);
    const cosmofeed = filteredEntries.filter(e => e.source === 'cosmofeed').reduce((s, e) => s + e.amount, 0);
    const spends = filteredEntries.filter(e => e.source === 'spends').reduce((s, e) => s + Math.abs(e.amount), 0);
    const totalIncome = projects + recurring + digital + other + cosmofeed;
    return { projects, recurring, digital, other, cosmofeed, spends, totalIncome, net: totalIncome - spends };
  }, [filteredEntries]);

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const periods: { key: TimePeriod; label: string; color: string }[] = [
    { key: 'all', label: 'All Time', color: 'from-indigo-500 to-violet-600' },
    { key: 'today', label: 'Today', color: 'from-green-500 to-emerald-600' },
    { key: 'yesterday', label: 'Yesterday', color: 'from-blue-500 to-cyan-600' },
    { key: 'week', label: 'This Week', color: 'from-orange-500 to-amber-600' },
    { key: 'month', label: 'This Month', color: 'from-purple-500 to-fuchsia-600' },
    { key: 'year', label: 'This Year', color: 'from-rose-500 to-pink-600' },
  ];

  const sourceConfig = [
    { key: 'projects' as const, label: 'Projects', icon: FolderKanban, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { key: 'recurring' as const, label: 'Recurring', icon: RefreshCw, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { key: 'digital' as const, label: 'Digital Products', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { key: 'other' as const, label: 'Other Income', icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { key: 'cosmofeed' as const, label: 'Cosmofeed', icon: ShoppingBag, color: 'text-teal-400', bg: 'bg-teal-500/20' },
  ];

  return (
    <div className="space-y-4">
      {/* Period Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => { setTimePeriod(p.key); if (p.key !== 'custom') { setCustomFrom(undefined); setCustomTo(undefined); } }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              timePeriod === p.key
                ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {p.label}
          </button>
        ))}

        {/* Custom Range */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1',
                timePeriod === 'custom'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {timePeriod === 'custom' && customFrom && customTo
                ? `${format(customFrom, 'dd MMM')} - ${format(customTo, 'dd MMM')}`
                : 'Custom'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 space-y-2" align="start">
            <p className="text-xs font-medium text-muted-foreground">From</p>
            <Calendar mode="single" selected={customFrom} onSelect={(d) => { setCustomFrom(d); setTimePeriod('custom'); }} className="p-2 pointer-events-auto" />
            <p className="text-xs font-medium text-muted-foreground">To</p>
            <Calendar mode="single" selected={customTo} onSelect={(d) => { setCustomTo(d); setTimePeriod('custom'); }} className="p-2 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        {timePeriod !== 'all' && (
          <button onClick={() => { setTimePeriod('all'); setCustomFrom(undefined); setCustomTo(undefined); }} className="px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Net Balance Card */}
      <Card className="border-0 bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-200 flex items-center gap-1"><Landmark className="h-3.5 w-3.5" /> Net Balance ({periods.find(p => p.key === timePeriod)?.label || 'Custom'})</p>
              <p className={cn('text-3xl font-bold mt-1', stats.net >= 0 ? 'text-white' : 'text-red-200')}>{fmt(stats.net)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-green-300 flex items-center gap-1 justify-end"><TrendingUp className="h-3 w-3" /> Income: {fmt(stats.totalIncome)}</p>
              <p className="text-xs text-red-300 flex items-center gap-1 justify-end"><TrendingDown className="h-3 w-3" /> Spends: {fmt(stats.spends)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sourceConfig.map(s => (
          <Card key={s.key} className="border border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('p-1.5 rounded-md', s.bg)}>
                  <s.icon className={cn('h-3.5 w-3.5', s.color)} />
                </div>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{fmt(stats[s.key])}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spends Card */}
      <Card className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-red-500/20">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Spends</span>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{fmt(stats.spends)}</p>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Transactions ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="max-h-[400px] overflow-y-auto space-y-1.5">
            {loading ? (
              <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
            ) : filteredEntries.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No transactions in this period</p>
            ) : (
              [...filteredEntries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, i) => {
                  const sourceLabels: Record<string, { label: string; color: string }> = {
                    projects: { label: 'Project', color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' },
                    recurring: { label: 'Recurring', color: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30' },
                    digital_products: { label: 'Digital', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30' },
                    other_income: { label: 'Other', color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30' },
                    spends: { label: 'Spend', color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' },
                    cosmofeed: { label: 'Cosmofeed', color: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30' },
                  };
                  const s = sourceLabels[entry.source];
                  return (
                    <div key={i} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', s.color)}>{s.label}</span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(entry.date), 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                      <span className={cn('text-sm font-semibold whitespace-nowrap ml-2', entry.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                        {entry.amount >= 0 ? '+' : ''}{fmt(entry.amount)}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceTracker;
