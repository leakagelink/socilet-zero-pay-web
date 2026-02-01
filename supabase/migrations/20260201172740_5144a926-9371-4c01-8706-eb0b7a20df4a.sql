-- Create reminders table for admin to manage custom reminders
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  reminder_time TIME,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'snoozed', 'cancelled')),
  category TEXT,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  related_client_name TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can access
CREATE POLICY "Admins can view all reminders"
  ON public.reminders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create reminders"
  ON public.reminders
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reminders"
  ON public.reminders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reminders"
  ON public.reminders
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient querying
CREATE INDEX idx_reminders_date ON public.reminders(reminder_date);
CREATE INDEX idx_reminders_status ON public.reminders(status);
CREATE INDEX idx_reminders_priority ON public.reminders(priority);