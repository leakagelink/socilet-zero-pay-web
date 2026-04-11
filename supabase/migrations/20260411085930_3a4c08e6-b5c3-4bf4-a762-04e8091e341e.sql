-- 1. FIX PRIVILEGE ESCALATION: Restrict user_roles INSERT to admins only
DROP POLICY IF EXISTS "Users can insert their own role or admins can insert any" ON public.user_roles;
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. FIX ANONYMOUS CHAT MESSAGE UPDATE: Remove public-role policy
DROP POLICY IF EXISTS "Anyone can update own messages" ON public.chat_messages;

-- 3. FIX ANONYMOUS WORKSPACE FILES: Remove public-role policies
DROP POLICY IF EXISTS "Anyone can delete own files" ON public.workspace_files;
DROP POLICY IF EXISTS "Anyone can upload files" ON public.workspace_files;

-- 4. FIX EMAIL LOGS EXPOSURE: Remove overly-permissive policies
DROP POLICY IF EXISTS "Service role can select email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_logs;

-- 5. FIX ANONYMOUS WORKSPACE MESSAGES: Remove public-role policy
DROP POLICY IF EXISTS "Anyone can send messages" ON public.workspace_messages;

-- 6. FIX MEETING PARTICIPANTS: Remove duplicate public-role policies (keep authenticated ones)
DROP POLICY IF EXISTS "Anyone can update their participant status" ON public.meeting_participants;
DROP POLICY IF EXISTS "Anyone can view meeting participants" ON public.meeting_participants;

-- 7. MAKE WORKSPACE-FILES BUCKET PRIVATE
UPDATE storage.buckets SET public = false WHERE id = 'workspace-files';

-- 8. FIX STORAGE POLICIES: Remove public-role policies on storage.objects for workspace-files
DROP POLICY IF EXISTS "Anyone can upload workspace files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view workspace files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete workspace files" ON storage.objects;

-- 9. FIX SECURITY DEFINER FUNCTIONS: Add search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;