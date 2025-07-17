-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'affiliate', 'user');

-- Create profiles table for basic user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '{"portfolio": true, "blog": true, "testimonials": true, "webmaster": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_users table for affiliate system
CREATE TABLE public.affiliate_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table for tracking affiliate referrals
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  project_budget DECIMAL(10,2),
  project_description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'rejected')),
  commission_amount DECIMAL(10,2) DEFAULT 0.00,
  commission_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_items table for portfolio management
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('websites', 'mobile-apps', 'ai-solutions')),
  image_url TEXT,
  description TEXT,
  project_url TEXT,
  is_react_project BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM public.admin_users WHERE user_id = user_uuid
    UNION ALL
    SELECT 'affiliate'::user_role FROM public.affiliate_users WHERE user_id = user_uuid
    UNION ALL
    SELECT 'user'::user_role WHERE user_uuid IS NOT NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

-- RLS Policies for admin_users table
CREATE POLICY "Admins can view admin users" 
ON public.admin_users FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update admin users" 
ON public.admin_users FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert admin users" 
ON public.admin_users FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for affiliate_users table
CREATE POLICY "Users can view their own affiliate data" 
ON public.affiliate_users FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own affiliate data" 
ON public.affiliate_users FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own affiliate data" 
ON public.affiliate_users FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all affiliate users" 
ON public.affiliate_users FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all affiliate users" 
ON public.affiliate_users FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for referrals table
CREATE POLICY "Affiliates can view their own referrals" 
ON public.referrals FOR SELECT 
USING (
  affiliate_id IN (
    SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Affiliates can insert their own referrals" 
ON public.referrals FOR INSERT 
WITH CHECK (
  affiliate_id IN (
    SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Affiliates can update their own referrals" 
ON public.referrals FOR UPDATE 
USING (
  affiliate_id IN (
    SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all referrals" 
ON public.referrals FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all referrals" 
ON public.referrals FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for portfolio_items table
CREATE POLICY "Everyone can view active portfolio items" 
ON public.portfolio_items FOR SELECT 
USING (is_active = TRUE);

CREATE POLICY "Admins can view all portfolio items" 
ON public.portfolio_items FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert portfolio items" 
ON public.portfolio_items FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update portfolio items" 
ON public.portfolio_items FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete portfolio items" 
ON public.portfolio_items FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_users_updated_at
  BEFORE UPDATE ON public.affiliate_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_affiliate_users_user_id ON public.affiliate_users(user_id);
CREATE INDEX idx_affiliate_users_referral_code ON public.affiliate_users(referral_code);
CREATE INDEX idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_portfolio_items_category ON public.portfolio_items(category);
CREATE INDEX idx_portfolio_items_active ON public.portfolio_items(is_active);

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_users;

-- Set replica identity for realtime updates
ALTER TABLE public.referrals REPLICA IDENTITY FULL;
ALTER TABLE public.portfolio_items REPLICA IDENTITY FULL;
ALTER TABLE public.affiliate_users REPLICA IDENTITY FULL;