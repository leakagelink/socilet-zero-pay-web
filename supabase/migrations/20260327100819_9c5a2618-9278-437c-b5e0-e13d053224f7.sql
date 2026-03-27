
CREATE TABLE public.cosmofeed_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_title TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  gst_amount NUMERIC NOT NULL DEFAULT 0,
  net_amount NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_by UUID DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cosmofeed_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view cosmofeed sales" ON public.cosmofeed_sales FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert cosmofeed sales" ON public.cosmofeed_sales FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update cosmofeed sales" ON public.cosmofeed_sales FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete cosmofeed sales" ON public.cosmofeed_sales FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.cosmofeed_sales;
