
import { supabase } from '@/integrations/supabase/client';

// Enhanced authentication utilities with security improvements
export const cleanupAuthState = () => {
  // Remove all authentication-related keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'admin-password') {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if present
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);
  
  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  attempts.count += 1;
  attempts.lastAttempt = now;
  return true;
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Secure sign in with rate limiting
export const secureSignIn = async (email: string, password: string) => {
  if (!checkRateLimit(email)) {
    throw new Error('Too many login attempts. Please try again later.');
  }
  
  try {
    // Clean up any existing auth state
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.warn('Global signout failed, continuing...', err);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Reset login attempts on successful login
    loginAttempts.delete(email);
    
    return { data, error: null };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

// Secure sign up with password validation
export const secureSignUp = async (email: string, password: string, fullName?: string) => {
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
  }
  
  try {
    cleanupAuthState();
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

// Secure sign out with complete cleanup
export const secureSignOut = async () => {
  try {
    cleanupAuthState();
    
    await supabase.auth.signOut({ scope: 'global' });
    
    // Force page reload for complete state cleanup
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
  } catch (error: any) {
    console.error('Logout error:', error);
    // Force cleanup even if signout fails
    window.location.href = '/auth';
  }
};
