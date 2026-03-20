
-- Fix 1: Drop overly permissive email_logs policies
DROP POLICY IF EXISTS "Service role can insert email logs" ON email_logs;
DROP POLICY IF EXISTS "Service role can select email logs" ON email_logs;

-- Fix 2: Drop all public meeting/chat/workspace policies and replace with authenticated-only

-- meetings
DROP POLICY IF EXISTS "Anyone can view meetings" ON meetings;
DROP POLICY IF EXISTS "Anyone can create meetings" ON meetings;
DROP POLICY IF EXISTS "Anyone can update meetings" ON meetings;

CREATE POLICY "Authenticated users can view meetings" ON meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create meetings" ON meetings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update meetings" ON meetings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- chat_rooms
DROP POLICY IF EXISTS "Anyone can view chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Anyone can create chat rooms" ON chat_rooms;

CREATE POLICY "Authenticated users can view chat rooms" ON chat_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create chat rooms" ON chat_rooms FOR INSERT TO authenticated WITH CHECK (true);

-- chat_messages
DROP POLICY IF EXISTS "Anyone can view messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON chat_messages;

CREATE POLICY "Authenticated users can view messages" ON chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can send messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update messages" ON chat_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- message_reactions
DROP POLICY IF EXISTS "Anyone can view reactions" ON message_reactions;
DROP POLICY IF EXISTS "Anyone can add reactions" ON message_reactions;
DROP POLICY IF EXISTS "Anyone can remove reactions" ON message_reactions;

CREATE POLICY "Authenticated users can view reactions" ON message_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can add reactions" ON message_reactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can remove reactions" ON message_reactions FOR DELETE TO authenticated USING (true);

-- meeting_participants
DROP POLICY IF EXISTS "Anyone can view participants" ON meeting_participants;
DROP POLICY IF EXISTS "Anyone can join meetings" ON meeting_participants;
DROP POLICY IF EXISTS "Anyone can update participant status" ON meeting_participants;
DROP POLICY IF EXISTS "Anyone can leave meetings" ON meeting_participants;

CREATE POLICY "Authenticated users can view participants" ON meeting_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can join meetings" ON meeting_participants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update participant status" ON meeting_participants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can leave meetings" ON meeting_participants FOR DELETE TO authenticated USING (true);

-- project_workspaces
DROP POLICY IF EXISTS "Anyone can view workspaces" ON project_workspaces;
DROP POLICY IF EXISTS "Anyone can create workspaces" ON project_workspaces;
DROP POLICY IF EXISTS "Anyone can update workspaces" ON project_workspaces;

CREATE POLICY "Authenticated users can view workspaces" ON project_workspaces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create workspaces" ON project_workspaces FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update workspaces" ON project_workspaces FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- workspace_files
DROP POLICY IF EXISTS "Anyone can view workspace files" ON workspace_files;
DROP POLICY IF EXISTS "Anyone can upload workspace files" ON workspace_files;
DROP POLICY IF EXISTS "Anyone can delete workspace files" ON workspace_files;

CREATE POLICY "Authenticated users can view workspace files" ON workspace_files FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can upload workspace files" ON workspace_files FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete workspace files" ON workspace_files FOR DELETE TO authenticated USING (true);

-- workspace_messages
DROP POLICY IF EXISTS "Anyone can view workspace messages" ON workspace_messages;
DROP POLICY IF EXISTS "Anyone can send workspace messages" ON workspace_messages;

CREATE POLICY "Authenticated users can view workspace messages" ON workspace_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can send workspace messages" ON workspace_messages FOR INSERT TO authenticated WITH CHECK (true);

-- Fix 3: Make workspace-files storage bucket private
UPDATE storage.buckets SET public = false WHERE id = 'workspace-files';

-- Fix storage policies: restrict to authenticated users
DROP POLICY IF EXISTS "Anyone can upload workspace files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view workspace files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete workspace files" ON storage.objects;

CREATE POLICY "Authenticated users can upload workspace files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'workspace-files');
CREATE POLICY "Authenticated users can view workspace files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'workspace-files');
CREATE POLICY "Authenticated users can delete workspace files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'workspace-files');
