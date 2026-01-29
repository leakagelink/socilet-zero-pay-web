-- Create digital_products table for tracking digital product sales
CREATE TABLE public.digital_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  original_price NUMERIC NOT NULL DEFAULT 0,
  resell_price NUMERIC NOT NULL DEFAULT 0,
  profit NUMERIC GENERATED ALWAYS AS (resell_price - original_price) STORED,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admins can view all digital products"
  ON public.digital_products
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert digital products"
  ON public.digital_products
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update digital products"
  ON public.digital_products
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete digital products"
  ON public.digital_products
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_digital_products_updated_at
  BEFORE UPDATE ON public.digital_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();