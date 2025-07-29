
-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_users table
CREATE TABLE public.affiliate_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  project_budget NUMERIC,
  project_description TEXT,
  commission_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Users can view their own admin record" 
  ON public.admin_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own admin record" 
  ON public.admin_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for affiliate_users
CREATE POLICY "Users can view their own affiliate record" 
  ON public.affiliate_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate record" 
  ON public.affiliate_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate record" 
  ON public.affiliate_users 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for referrals
CREATE POLICY "Affiliates can view their own referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_users 
      WHERE affiliate_users.id = referrals.affiliate_id 
      AND affiliate_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Affiliates can create their own referrals" 
  ON public.referrals 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.affiliate_users 
      WHERE affiliate_users.id = referrals.affiliate_id 
      AND affiliate_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Affiliates can update their own referrals" 
  ON public.referrals 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_users 
      WHERE affiliate_users.id = referrals.affiliate_id 
      AND affiliate_users.user_id = auth.uid()
    )
  );

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON public.admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_users_updated_at 
  BEFORE UPDATE ON public.affiliate_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at 
  BEFORE UPDATE ON public.referrals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_affiliate_users_user_id ON public.affiliate_users(user_id);
CREATE INDEX idx_affiliate_users_referral_code ON public.affiliate_users(referral_code);
CREATE INDEX idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
