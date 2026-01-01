-- Create affiliate_users table
CREATE TABLE public.affiliate_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    total_earnings NUMERIC DEFAULT 0,
    pending_earnings NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliate_users(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    project_type TEXT NOT NULL,
    project_value NUMERIC DEFAULT 0,
    commission_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.affiliate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS for affiliate_users: users can view/update their own record
CREATE POLICY "Users can view their own affiliate profile"
ON public.affiliate_users FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate profile"
ON public.affiliate_users FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliate profile"
ON public.affiliate_users FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS for referrals: affiliates can view/insert their own referrals
CREATE POLICY "Affiliates can view their own referrals"
ON public.referrals FOR SELECT TO authenticated
USING (affiliate_id IN (SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can insert their own referrals"
ON public.referrals FOR INSERT TO authenticated
WITH CHECK (affiliate_id IN (SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()));