import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Loader2, LogOut, Shield, FolderKanban, Package, TrendingUp, IndianRupee, RefreshCw, Wallet, Mail, Key, FileText, LayoutGrid, Bell, FileSpreadsheet, Bot, ShieldAlert, AlarmClock, PiggyBank, TrendingDown, Landmark, Pencil, Check, X, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectManager from '@/components/admin/ProjectManager';
import DigitalProductManager from '@/components/admin/DigitalProductManager';
import RecurringEarningsManager from '@/components/admin/RecurringEarningsManager';
import OtherIncomeManager from '@/components/admin/OtherIncomeManager';
import RevenueCharts from '@/components/admin/RevenueCharts';
import EmailManager from '@/components/admin/EmailManager';
import ServiceCredentialsManager from '@/components/admin/ServiceCredentialsManager';
import InvoiceManager from '@/components/admin/InvoiceManager';
import KanbanBoard from '@/components/admin/KanbanBoard';
import NotificationManager from '@/components/admin/NotificationManager';
import QuotationGenerator from '@/components/admin/QuotationGenerator';
import AIProjectAnalyzer from '@/components/admin/AIProjectAnalyzer';
import { BlockedMessagesViewer } from '@/components/admin/BlockedMessagesViewer';
import ReminderManager from '@/components/admin/ReminderManager';
import InvestmentManager from '@/components/admin/InvestmentManager';
import SpendManager from '@/components/admin/SpendManager';
import PaymentMethodsManager from '@/components/admin/PaymentMethodsManager';
import BalanceTracker from '@/components/admin/BalanceTracker';
import CosmofeedSalesManager from '@/components/admin/CosmofeedSalesManager';
import EmailNotificationDropdown from '@/components/admin/EmailNotificationDropdown';
import { useCountUp } from '@/hooks/useCountUp';

// Animated Currency Display Component
const AnimatedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const animatedValue = useCountUp({ end: value, duration: 1500, delay: 100 });
  
  const formatted = new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(animatedValue);
  
  return <span className={className}>{formatted}</span>;
};

interface RevenueStats {
  projectsRevenue: number;
  projectsPending: number;
  digitalRevenue: number;
  digitalProfit: number;
  otherIncome: number;
  totalRevenue: number;
  totalSpends: number;
  recurringEarnings: number;
  availableBalance: number;
}

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    projectsRevenue: 0,
    projectsPending: 0,
    digitalRevenue: 0,
    digitalProfit: 0,
    otherIncome: 0,
    totalRevenue: 0,
    totalSpends: 0,
    recurringEarnings: 0,
    availableBalance: 0,
  });
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');

  // Fetch revenue stats
  const fetchRevenueStats = async () => {
    try {
      const [projectsRes, digitalRes, otherRes, spendsRes, recurringRes, balanceRes, cosmofeedRes] = await Promise.all([
        supabase.from('projects').select('total_amount, remaining_amount, advance_amount'),
        supabase.from('digital_products').select('resell_price, profit'),
        supabase.from('other_income').select('amount, paid_amount, status'),
        supabase.from('spends').select('amount'),
        supabase.from('recurring_earnings').select('amount, is_active'),
        (supabase as any).from('bank_balance_settings').select('base_balance').limit(1).single(),
        (supabase as any).from('cosmofeed_sales').select('net_amount'),
      ]);

      const projects = projectsRes.data;
      const digitalProducts = digitalRes.data;
      const otherIncomes = otherRes.data;
      const spends = spendsRes.data;
      const recurring = recurringRes.data;
      const baseBalance = (balanceRes.data as any)?.base_balance || 0;
      const cosmofeedTotal = (cosmofeedRes.data as any[])?.reduce((sum: number, c: any) => sum + (c.net_amount || 0), 0) || 0;

      const projectsRevenue = projects?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
      const projectsPending = projects?.reduce((sum, p) => sum + (p.remaining_amount || 0), 0) || 0;
      const projectsReceived = projects?.reduce((sum, p) => sum + (p.advance_amount || 0), 0) || 0;
      const digitalRevenue = digitalProducts?.reduce((sum, p) => sum + (p.resell_price || 0), 0) || 0;
      const digitalProfit = digitalProducts?.reduce((sum, p) => sum + (p.profit || 0), 0) || 0;
      const otherIncomeTotal = otherIncomes?.reduce((sum, o) => {
        if (o.status === 'paid') return sum + (o.amount || 0);
        if (o.status === 'partial') return sum + (o.paid_amount || 0);
        return sum;
      }, 0) || 0;
      const totalSpends = spends?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;
      const recurringEarnings = recurring?.filter(r => r.is_active).reduce((sum, r) => sum + (r.amount || 0), 0) || 0;

      const totalIncome = projectsReceived + digitalRevenue + otherIncomeTotal + cosmofeedTotal;
      const availableBalance = baseBalance + totalIncome - totalSpends;

      setRevenueStats({
        projectsRevenue,
        projectsPending,
        digitalRevenue,
        digitalProfit,
        otherIncome: otherIncomeTotal,
        totalRevenue: totalIncome,
        totalSpends,
        recurringEarnings,
        availableBalance,
      });
    } catch (err) {
      console.error('Error fetching revenue stats:', err);
    }
  };

  const handleUpdateBalance = async () => {
    const desiredBalance = parseFloat(balanceInput);
    if (isNaN(desiredBalance)) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      // Reverse calculate: base_balance = desired - income + spends
      const newBase = desiredBalance - revenueStats.totalRevenue + revenueStats.totalSpends;

      const { data: existing, error: fetchErr } = await (supabase as any)
        .from('bank_balance_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (fetchErr) throw fetchErr;
      
      if (existing) {
        const { error: updateErr } = await (supabase as any)
          .from('bank_balance_settings')
          .update({ base_balance: newBase, last_updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        
        if (updateErr) throw updateErr;
      }
      
      toast.success('Balance updated to ₹' + desiredBalance.toLocaleString('en-IN'));
      setIsEditingBalance(false);
      setBalanceInput('');
      fetchRevenueStats();
    } catch (err: any) {
      console.error('Balance update error:', err);
      toast.error('Failed to update balance: ' + (err.message || 'Unknown error'));
    }
  };

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verify admin role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          if (roleData) {
            setIsLoggedIn(true);
            setUserEmail(session.user.email ?? null);
            fetchRevenueStats();
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Realtime subscription for balance updates
  useEffect(() => {
    if (!isLoggedIn) return;

    // Poll for updates every 30 seconds (realtime removed for security)
    const interval = setInterval(() => {
      fetchRevenueStats();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoginLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        await supabase.auth.signOut();
        throw new Error('Failed to verify admin status');
      }

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      setIsLoggedIn(true);
      setUserEmail(authData.user.email ?? null);
      fetchRevenueStats();
      toast.success('Welcome to Admin Panel!');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail(null);
    toast.success('Logged out successfully');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-xl border">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Enter your credentials to access
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                disabled={isLoginLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoginLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <Button type="submit" className="w-full h-11" disabled={isLoginLoading}>
              {isLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage your business</p>
            </div>
            <h1 className="text-lg font-bold text-foreground sm:hidden">Admin</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <EmailNotificationDropdown 
              onNavigateToEmails={() => {
                // Scroll to emails tab or switch to it
                const emailsTab = document.querySelector('[value="emails"]') as HTMLButtonElement;
                if (emailsTab) emailsTab.click();
              }}
            />
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">{userEmail}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Revenue Dashboard */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Revenue Dashboard</h2>
              <p className="text-sm text-muted-foreground">Track your earnings</p>
            </div>
          </div>
          
          {/* Available Balance - Prominent Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <Card className="sm:col-span-1 group relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardHeader className="pb-1 px-4 pt-4 relative">
                <CardTitle className="text-xs font-medium text-indigo-100 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    Available Balance
                  </span>
                  {!isEditingBalance && (
                    <button
                      onClick={() => {
                        setBalanceInput(revenueStats.availableBalance.toString());
                        setIsEditingBalance(true);
                      }}
                      className="p-1 rounded-md hover:bg-white/20 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-indigo-200" />
                    </button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 relative">
                {isEditingBalance ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">₹</span>
                      <Input
                        type="number"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        className="h-9 bg-white/20 border-white/30 text-white placeholder:text-white/50 text-lg font-bold"
                        placeholder="Enter balance"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateBalance} className="h-7 px-3 bg-white/20 hover:bg-white/30 text-white text-xs">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setIsEditingBalance(false); setBalanceInput(''); }} className="h-7 px-3 text-white/80 hover:text-white hover:bg-white/10 text-xs">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={`text-2xl sm:text-3xl font-bold ${revenueStats.availableBalance >= 0 ? 'text-white' : 'text-red-200'}`}>
                      <AnimatedCurrency value={revenueStats.availableBalance} />
                    </p>
                    <p className="text-xs text-indigo-100/80 mt-1">Base + Income - Spends</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardHeader className="pb-1 px-4 pt-4 relative">
                <CardTitle className="text-xs font-medium text-red-100 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Total Spends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 relative">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  <AnimatedCurrency value={revenueStats.totalSpends} />
                </p>
                <p className="text-xs text-red-100/80 mt-1">All expenses</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardHeader className="pb-1 px-4 pt-4 relative">
                <CardTitle className="text-xs font-medium text-cyan-100 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Monthly Recurring
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 relative">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  <AnimatedCurrency value={revenueStats.recurringEarnings} />
                </p>
                <p className="text-xs text-cyan-100/80 mt-1">Active subscriptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Existing Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <Card className="col-span-2 sm:col-span-1 group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardHeader className="pb-1 px-4 pt-4 relative">
                <CardTitle className="text-xs font-medium text-emerald-100 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 relative">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  <AnimatedCurrency value={revenueStats.totalRevenue} />
                </p>
                <p className="text-xs text-emerald-100/80 mt-1">Received amount</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader className="pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">Projects Total</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <AnimatedCurrency value={revenueStats.projectsRevenue} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">All projects value</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <CardHeader className="pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  <AnimatedCurrency value={revenueStats.projectsPending} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yet to receive</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">Digital Sales</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  <AnimatedCurrency value={revenueStats.digitalRevenue} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">Products sold</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
              <div className={`absolute top-0 left-0 w-full h-1 ${revenueStats.digitalProfit >= 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>
              <CardHeader className="pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">Digital Profit</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className={`text-xl sm:text-2xl font-bold ${revenueStats.digitalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  <AnimatedCurrency value={revenueStats.digitalProfit} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">Net profit</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardHeader className="pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Other Income
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                  <AnimatedCurrency value={revenueStats.otherIncome} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">Miscellaneous</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Charts Section */}
        <RevenueCharts />

        <Tabs defaultValue="projects" className="space-y-4 sm:space-y-6" onValueChange={() => fetchRevenueStats()}>
          {/* Modern pill-style tabs */}
          <div className="bg-card rounded-2xl p-2 shadow-sm border">
            <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 lg:grid-cols-15 gap-2 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="projects" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <FolderKanban className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quotations" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Quotations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-analyzer" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI Analyzer</span>
              </TabsTrigger>
              <TabsTrigger 
                value="invoices" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Invoices</span>
              </TabsTrigger>
              <TabsTrigger 
                value="digital" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Digital</span>
              </TabsTrigger>
              <TabsTrigger 
                value="recurring" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Recurring</span>
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Other</span>
              </TabsTrigger>
              <TabsTrigger 
                value="blocked" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="hidden sm:inline">Blocked</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <AlarmClock className="h-4 w-4" />
                <span className="hidden sm:inline">Reminders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="emails" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Emails</span>
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger 
                value="investments" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <PiggyBank className="h-4 w-4" />
                <span className="hidden sm:inline">Investments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payment-methods" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <IndianRupee className="h-4 w-4" />
                <span className="hidden sm:inline">Pay Methods</span>
              </TabsTrigger>
              <TabsTrigger 
                value="spends" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <TrendingDown className="h-4 w-4" />
                <span className="hidden sm:inline">Spends</span>
              </TabsTrigger>
              <TabsTrigger 
                value="balance-tracker" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <Landmark className="h-4 w-4" />
                <span className="hidden sm:inline">Balance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cosmofeed" 
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Cosmofeed</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects" className="mt-6 animate-fade-in">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6 animate-fade-in">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="quotations" className="mt-6 animate-fade-in">
            <QuotationGenerator />
          </TabsContent>

          <TabsContent value="ai-analyzer" className="mt-6 animate-fade-in">
            <AIProjectAnalyzer />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6 animate-fade-in">
            <InvoiceManager />
          </TabsContent>

          <TabsContent value="digital" className="mt-6 animate-fade-in">
            <DigitalProductManager />
          </TabsContent>

          <TabsContent value="recurring" className="mt-6 animate-fade-in">
            <RecurringEarningsManager />
          </TabsContent>

          <TabsContent value="other" className="mt-6 animate-fade-in">
            <OtherIncomeManager />
          </TabsContent>

          <TabsContent value="blocked" className="mt-6 animate-fade-in">
            <BlockedMessagesViewer />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 animate-fade-in">
            <NotificationManager />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6 animate-fade-in">
            <ReminderManager />
          </TabsContent>

          <TabsContent value="emails" className="mt-6 animate-fade-in">
            <EmailManager />
          </TabsContent>

          <TabsContent value="credentials" className="mt-6 animate-fade-in">
            <ServiceCredentialsManager />
          </TabsContent>

          <TabsContent value="investments" className="mt-6 animate-fade-in">
            <InvestmentManager />
          </TabsContent>

          <TabsContent value="spends" className="mt-6 animate-fade-in">
            <SpendManager />
          </TabsContent>

          <TabsContent value="payment-methods" className="mt-6 animate-fade-in">
            <PaymentMethodsManager />
          </TabsContent>

          <TabsContent value="balance-tracker" className="mt-6 animate-fade-in">
            <BalanceTracker />
          </TabsContent>

          <TabsContent value="cosmofeed" className="mt-6 animate-fade-in">
            <CosmofeedSalesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
