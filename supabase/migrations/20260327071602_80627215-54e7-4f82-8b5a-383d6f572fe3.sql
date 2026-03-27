CREATE TABLE public.bank_balance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_balance numeric NOT NULL DEFAULT 0,
  last_updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  notes text
);

ALTER TABLE public.bank_balance_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bank balance" ON public.bank_balance_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.bank_balance_settings (base_balance, notes) VALUES (0, 'Initial balance');