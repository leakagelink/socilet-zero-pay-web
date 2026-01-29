import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Loader2, LogOut, Shield, FolderKanban, Package, TrendingUp, IndianRupee } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectManager from '@/components/admin/ProjectManager';
import DigitalProductManager from '@/components/admin/DigitalProductManager';

interface RevenueStats {
  projectsRevenue: number;
  projectsPending: number;
  digitalRevenue: number;
  digitalProfit: number;
  totalRevenue: number;
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
    totalRevenue: 0,
  });

  // Fetch revenue stats
  const fetchRevenueStats = async () => {
    try {
      // Fetch projects data
      const { data: projects } = await supabase
        .from('projects')
        .select('total_amount, remaining_amount, advance_amount');

      // Fetch digital products data
      const { data: digitalProducts } = await supabase
        .from('digital_products')
        .select('resell_price, profit');

      const projectsRevenue = projects?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
      const projectsPending = projects?.reduce((sum, p) => sum + (p.remaining_amount || 0), 0) || 0;
      const projectsReceived = projects?.reduce((sum, p) => sum + (p.advance_amount || 0), 0) || 0;
      const digitalRevenue = digitalProducts?.reduce((sum, p) => sum + (p.resell_price || 0), 0) || 0;
      const digitalProfit = digitalProducts?.reduce((sum, p) => sum + (p.profit || 0), 0) || 0;

      setRevenueStats({
        projectsRevenue,
        projectsPending,
        digitalRevenue,
        digitalProfit,
        totalRevenue: projectsReceived + digitalRevenue,
      });
    } catch (err) {
      console.error('Error fetching revenue stats:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-muted/10">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Revenue Dashboard */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Revenue Dashboard
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(revenueStats.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Received amount</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Projects Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(revenueStats.projectsRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All projects value</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(revenueStats.projectsPending)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yet to receive</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Digital Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(revenueStats.digitalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Products sold</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Digital Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${revenueStats.digitalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(revenueStats.digitalProfit)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Net profit</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6" onValueChange={() => fetchRevenueStats()}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="digital" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Digital Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="digital">
            <DigitalProductManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
