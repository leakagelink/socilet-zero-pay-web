
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from '../components/admin/AdminHeader';
import PortfolioManager from '../components/admin/PortfolioManager';
import BlogManager from '../components/admin/BlogManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import WebsitePhotosManager from '../components/admin/WebsitePhotosManager';
import WebmasterManager from '../components/admin/WebmasterManager';
import AdminLogin from '../components/admin/AdminLogin';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if user is admin
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Authentication state management
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const adminStatus = await checkAdminStatus(session.user.id);
        setIsAdmin(adminStatus);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const adminStatus = await checkAdminStatus(data.user.id);
        if (!adminStatus) {
          await supabase.auth.signOut();
          toast.error('Access denied. Admin privileges required.');
          return;
        }
        toast.success('Login successful');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !user || !isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Panel - Socilet</title>
      </Helmet>
      
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-800">Admin Dashboard</h1>
        
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto">
            <TabsTrigger value="portfolio">Portfolio Items</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="testimonials">Video Testimonials</TabsTrigger>
            <TabsTrigger value="photos">Website Photos</TabsTrigger>
            <TabsTrigger value="webmaster">Webmaster Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="border rounded-lg p-6 bg-white">
            <PortfolioManager />
          </TabsContent>
          
          <TabsContent value="blog" className="border rounded-lg p-6 bg-white">
            <BlogManager />
          </TabsContent>
          
          <TabsContent value="testimonials" className="border rounded-lg p-6 bg-white">
            <TestimonialManager />
          </TabsContent>
          
          <TabsContent value="photos" className="border rounded-lg p-6 bg-white">
            <WebsitePhotosManager />
          </TabsContent>
          
          <TabsContent value="webmaster" className="border rounded-lg p-6 bg-white">
            <WebmasterManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
