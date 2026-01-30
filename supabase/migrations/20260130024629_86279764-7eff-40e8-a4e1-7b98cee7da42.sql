-- Create recurring earnings table for monthly/yearly subscriptions
CREATE TABLE public.recurring_earnings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    project_name TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'yearly')),
    billing_date INTEGER NOT NULL DEFAULT 1 CHECK (billing_date >= 1 AND billing_date <= 31),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_billing_date DATE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    payment_method TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recurring_earnings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admins can view all recurring earnings" 
ON public.recurring_earnings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert recurring earnings" 
ON public.recurring_earnings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update recurring earnings" 
ON public.recurring_earnings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete recurring earnings" 
ON public.recurring_earnings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recurring_earnings_updated_at
BEFORE UPDATE ON public.recurring_earnings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();