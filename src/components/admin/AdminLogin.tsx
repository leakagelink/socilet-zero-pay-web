
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string) => void;
}

const AdminLogin = ({ onLogin, onSignUp }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() === '' || password.trim() === '') {
      toast.error('Please enter both email and password');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      onSignUp?.(email, password);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          {isSignUp ? (
            <UserPlus className="mx-auto h-12 w-12 text-primary-600" />
          ) : (
            <Lock className="mx-auto h-12 w-12 text-primary-600" />
          )}
          <h1 className="mt-4 text-3xl font-bold text-primary-800">
            {isSignUp ? 'Admin Sign Up' : 'Admin Login'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isSignUp ? 'Create a new admin account' : 'Enter your credentials to access the admin panel'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="Enter admin email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Enter password"
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Confirm password"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setConfirmPassword('');
            }}
            className="text-sm text-primary-600 hover:text-primary-800 hover:underline"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
