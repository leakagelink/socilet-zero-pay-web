-- Drop the existing check constraint and add new one with partial status
ALTER TABLE public.other_income DROP CONSTRAINT IF EXISTS other_income_status_check;

ALTER TABLE public.other_income ADD CONSTRAINT other_income_status_check 
CHECK (status IN ('paid', 'pending', 'partial'));