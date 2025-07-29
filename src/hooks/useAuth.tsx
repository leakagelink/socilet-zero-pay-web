
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { secureSignIn, secureSignUp, secureSignOut, cleanupAuthState } from '@/lib/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAffiliate: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);

  const checkUserRole = async (userId: string) => {
    try {
      // Check if admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (adminData) {
        setIsAdmin(true);
        setIsAffiliate(false);
        return;
      }

      // Check if affiliate
      const { data: affiliateData } = await supabase
        .from('affiliate_users')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (affiliateData) {
        setIsAdmin(false);
        setIsAffiliate(true);
        return;
      }

      // Regular user
      setIsAdmin(false);
      setIsAffiliate(false);
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      setIsAffiliate(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', { event, session: !!session });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role checking to prevent deadlocks
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsAffiliate(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsAffiliate(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        cleanupAuthState();
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await secureSignIn(email, password);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      await secureSignUp(email, password, fullName);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await secureSignOut();
      setIsAdmin(false);
      setIsAffiliate(false);
    } catch (error) {
      console.error('Error signing out:', error);
      // Force cleanup even if signout fails
      cleanupAuthState();
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    loading,
    isAdmin,
    isAffiliate,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
