-- Create table for inbound emails from Resend webhook
CREATE TABLE public.inbound_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  headers JSONB,
  attachments JSONB,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

-- Admin can view all inbound emails
CREATE POLICY "Admins can view inbound emails"
  ON public.inbound_emails
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update inbound emails (mark as read/archived)
CREATE POLICY "Admins can update inbound emails"
  ON public.inbound_emails
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete inbound emails
CREATE POLICY "Admins can delete inbound emails"
  ON public.inbound_emails
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow webhook to insert (service role will be used)
CREATE POLICY "Service can insert inbound emails"
  ON public.inbound_emails
  FOR INSERT
  WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_inbound_emails_received_at ON public.inbound_emails(received_at DESC);
CREATE INDEX idx_inbound_emails_is_read ON public.inbound_emails(is_read);