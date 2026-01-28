import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from '../components/admin/AdminHeader';
import PortfolioManager from '../components/admin/PortfolioManager';
import BlogManager from '../components/admin/BlogManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import WebsitePhotosManager from '../components/admin/WebsitePhotosManager';
import WebmasterManager from '../components/admin/WebmasterManager';
import ProjectManager from '../components/admin/ProjectManager';
import AdminLogin from '../components/admin/AdminLogin';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Check existing session on mount
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
            setUserEmail(session.user.email || '');
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUserEmail('');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setError(null);

    try {
      console.log('Attempting login via edge function...');
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log('Edge function response status:', response.status);

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      if (result.success && result.session) {
        // Set session in Supabase client
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });

        setIsLoggedIn(true);
        setUserEmail(email);
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserEmail('');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} isLoading={loginLoading} error={error} />;
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Panel - Socilet</title>
      </Helmet>
      
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {userEmail}</p>
        </div>
        
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto">
            <TabsTrigger value="projects">Client Projects</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Items</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="testimonials">Video Testimonials</TabsTrigger>
            <TabsTrigger value="photos">Website Photos</TabsTrigger>
            <TabsTrigger value="webmaster">Webmaster Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="border rounded-lg p-6 bg-card">
            <ProjectManager />
          </TabsContent>
          
          <TabsContent value="portfolio" className="border rounded-lg p-6 bg-card">
            <PortfolioManager />
          </TabsContent>
          
          <TabsContent value="blog" className="border rounded-lg p-6 bg-card">
            <BlogManager />
          </TabsContent>
          
          <TabsContent value="testimonials" className="border rounded-lg p-6 bg-card">
            <TestimonialManager />
          </TabsContent>
          
          <TabsContent value="photos" className="border rounded-lg p-6 bg-card">
            <WebsitePhotosManager />
          </TabsContent>
          
          <TabsContent value="webmaster" className="border rounded-lg p-6 bg-card">
            <WebmasterManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
