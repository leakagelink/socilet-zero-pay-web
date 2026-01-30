-- Add status and due_date columns to other_income table
ALTER TABLE public.other_income 
ADD COLUMN status text NOT NULL DEFAULT 'paid',
ADD COLUMN due_date date;

-- Add check constraint for valid status values
ALTER TABLE public.other_income 
ADD CONSTRAINT other_income_status_check CHECK (status IN ('pending', 'paid'));