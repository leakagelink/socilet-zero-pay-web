
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
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Check if user is admin using the secure has_role function
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      if (data) {
        setIsAdmin(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setAuthError('Failed to check admin status');
      return false;
    }
  };

  // Initialize authentication
  useEffect(() => {
    console.log('Admin component mounted, initializing auth...');
    
    let timeoutId: NodeJS.Timeout;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session: !!session });
        
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found in session, checking admin status...');
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          console.log('No user in session');
          setIsAdmin(false);
        }
        
        // Set a timeout to ensure loading state doesn't persist indefinitely
        timeoutId = setTimeout(() => {
          console.log('Setting loading to false after timeout');
          setLoading(false);
        }, 100);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthError('Failed to get session');
          setLoading(false);
          return;
        }
        
        console.log('Existing session check:', { session: !!session });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Existing session found, checking admin status...');
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          console.log('No existing session found');
          setIsAdmin(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error in session check:', error);
        setAuthError('Unexpected authentication error');
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log('Admin component unmounting...');
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      setAuthError(null);
      setLoading(true);
      
      // Use supabase.functions.invoke for proper CORS handling
      const { data: edgeResult, error: edgeError } = await supabase.functions.invoke('admin-login', {
        body: { email, password }
      });
      
      if (edgeError) {
        console.error('Edge function error:', edgeError);
        throw new Error(edgeError.message || 'Login failed');
      }
      
      if (edgeResult?.success && edgeResult?.session) {
        // Set the session from edge function response
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: edgeResult.session.access_token,
          refresh_token: edgeResult.session.refresh_token
        });
        
        if (sessionError) {
          throw sessionError;
        }
        
        setIsAdmin(true);
        setLoading(false);
        toast.success('Login successful!');
        return;
      }
      
      if (edgeResult?.error) {
        throw new Error(edgeResult.error);
      }
      
      throw new Error('Unexpected response from server');
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoading(false);
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      setAuthError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setIsAdmin(false);
      setAuthError(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    }
  };

  // Loading state with more information
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
          {authError && (
            <p className="text-red-600 mt-2 text-sm">{authError}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Debug: session={!!session}, user={!!user}, isAdmin={isAdmin}
          </p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated or not admin
  if (!session || !user || !isAdmin) {
    return (
      <div>
        <AdminLogin onLogin={handleLogin} />
        {authError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {authError}
          </div>
        )}
      </div>
    );
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
