-- First create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create projects table for client project management
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_status TEXT NOT NULL DEFAULT 'pending' CHECK (project_status IN ('pending', 'running', 'completed')),
  advance_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  remaining_amount NUMERIC DEFAULT 0,
  payment_method TEXT,
  project_file_url TEXT,
  start_date DATE,
  end_date DATE,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Only admins can view projects
CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert projects
CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update projects
CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();