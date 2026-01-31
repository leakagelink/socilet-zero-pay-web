-- Create email_logs table to track sent emails and payment reminders
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type TEXT NOT NULL DEFAULT 'manual', -- 'payment_reminder', 'manual', 'notification'
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body_preview TEXT,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  related_recurring_id UUID REFERENCES public.recurring_earnings(id) ON DELETE SET NULL,
  related_other_income_id UUID REFERENCES public.other_income(id) ON DELETE SET NULL,
  days_until_due INTEGER,
  error_message TEXT,
  sent_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admin only policies
CREATE POLICY "Admins can view all email logs" 
ON public.email_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert email logs"
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can select email logs"
ON public.email_logs 
FOR SELECT 
USING (true);

-- Create contact_messages table to store messages received via contact form
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admin only policies for contact messages
CREATE POLICY "Admins can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));