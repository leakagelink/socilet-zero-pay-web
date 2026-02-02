-- Add paid_amount column to other_income table for partial payment tracking
ALTER TABLE public.other_income 
ADD COLUMN paid_amount numeric DEFAULT 0;

-- Update existing paid records to have paid_amount = amount
UPDATE public.other_income 
SET paid_amount = amount 
WHERE status = 'paid';

-- Add comment for documentation
COMMENT ON COLUMN public.other_income.paid_amount IS 'Amount that has been paid so far (for partial payments)';