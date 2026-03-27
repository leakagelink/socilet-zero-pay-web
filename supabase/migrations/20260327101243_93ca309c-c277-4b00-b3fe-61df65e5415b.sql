
CREATE TABLE public.cosmofeed_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_title TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  gst_amount NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cosmofeed_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view cosmofeed products" ON public.cosmofeed_products FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert cosmofeed products" ON public.cosmofeed_products FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update cosmofeed products" ON public.cosmofeed_products FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete cosmofeed products" ON public.cosmofeed_products FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add product_id reference to cosmofeed_sales
ALTER TABLE public.cosmofeed_sales ADD COLUMN product_id UUID REFERENCES public.cosmofeed_products(id) ON DELETE SET NULL;
