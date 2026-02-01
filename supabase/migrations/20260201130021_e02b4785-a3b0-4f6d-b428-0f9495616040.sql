-- Create project_workspaces table for persistent collaboration
CREATE TABLE public.project_workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add project_workspace_id to meetings table
ALTER TABLE public.meetings ADD COLUMN project_workspace_id UUID REFERENCES public.project_workspaces(id);

-- Create workspace_files table for shared files
CREATE TABLE public.workspace_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.project_workspaces(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workspace_messages table for persistent chat
CREATE TABLE public.workspace_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.project_workspaces(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  parent_message_id UUID REFERENCES public.workspace_messages(id),
  is_from_meeting BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

-- Public access policies (anyone with project code can access)
CREATE POLICY "Anyone can view workspaces" ON public.project_workspaces FOR SELECT USING (true);
CREATE POLICY "Anyone can create workspaces" ON public.project_workspaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update workspaces" ON public.project_workspaces FOR UPDATE USING (true);

CREATE POLICY "Anyone can view workspace files" ON public.workspace_files FOR SELECT USING (true);
CREATE POLICY "Anyone can upload files" ON public.workspace_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own files" ON public.workspace_files FOR DELETE USING (true);

CREATE POLICY "Anyone can view workspace messages" ON public.workspace_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can send messages" ON public.workspace_messages FOR INSERT WITH CHECK (true);

-- Enable realtime for workspace messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_messages;

-- Create function to generate short project code
CREATE OR REPLACE FUNCTION public.generate_project_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  nums TEXT := '23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Generate format: ABC-1234
  FOR i IN 1..3 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  result := result || '-';
  FOR i IN 1..4 LOOP
    result := result || substr(nums, floor(random() * length(nums) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create trigger to auto-generate project code
CREATE OR REPLACE FUNCTION public.set_project_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.project_code IS NULL OR NEW.project_code = '' THEN
    LOOP
      new_code := generate_project_code();
      SELECT EXISTS(SELECT 1 FROM project_workspaces WHERE project_code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.project_code := new_code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_project_code
BEFORE INSERT ON public.project_workspaces
FOR EACH ROW
EXECUTE FUNCTION public.set_project_code();

-- Update timestamp trigger
CREATE TRIGGER update_project_workspaces_updated_at
BEFORE UPDATE ON public.project_workspaces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();