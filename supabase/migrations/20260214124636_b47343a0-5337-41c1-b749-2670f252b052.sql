
-- Create spends table for tracking business expenses
CREATE TABLE public.spends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  amount NUMERIC NOT NULL DEFAULT 0,
  spend_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spends ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view all spends"
ON public.spends FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert spends"
ON public.spends FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update spends"
ON public.spends FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete spends"
ON public.spends FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_spends_updated_at
BEFORE UPDATE ON public.spends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
