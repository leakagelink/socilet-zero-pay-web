-- Create invoice status enum
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Create invoices table
CREATE TABLE public.invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    client_address TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_rate NUMERIC(5,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    due_date DATE,
    status invoice_status NOT NULL DEFAULT 'draft',
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task status enum
CREATE TYPE public.task_status AS ENUM ('backlog', 'todo', 'in_progress', 'review', 'done');

-- Create task priority enum
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tasks table for kanban board
CREATE TABLE public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'backlog',
    priority task_priority NOT NULL DEFAULT 'medium',
    assignee_name TEXT,
    due_date DATE,
    labels TEXT[] DEFAULT '{}',
    position INTEGER NOT NULL DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification type enum
CREATE TYPE public.notification_type AS ENUM ('payment_reminder', 'task_due', 'project_update', 'invoice_sent', 'general');

-- Create notifications log table
CREATE TABLE public.notifications_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_type notification_type NOT NULL,
    recipient_name TEXT,
    recipient_email TEXT,
    recipient_phone TEXT,
    channel TEXT NOT NULL DEFAULT 'email',
    subject TEXT,
    message TEXT NOT NULL,
    related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    related_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    related_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices (admin only)
CREATE POLICY "Admins can manage invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for tasks (admin only)
CREATE POLICY "Admins can manage tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for notifications_log (admin only)
CREATE POLICY "Admins can manage notifications"
ON public.notifications_log
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    result TEXT;
BEGIN
    current_year := to_char(now(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || current_year || '%';
    result := 'INV-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
    RETURN result;
END;
$$;

-- Create trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_invoice_number();

-- Create trigger to update updated_at
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();