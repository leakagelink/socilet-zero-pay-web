
-- STORAGE: workspace-files bucket policies (owner is UUID)
CREATE POLICY "Auth upload workspace storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'workspace-files');
CREATE POLICY "Auth view workspace storage" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'workspace-files');
CREATE POLICY "Auth delete own workspace storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'workspace-files' AND owner = auth.uid());

-- WORKSPACE FILES table: ownership delete
DROP POLICY IF EXISTS "Auth delete own workspace files" ON public.workspace_files;
CREATE POLICY "Auth delete own workspace files" ON public.workspace_files FOR DELETE TO authenticated USING (uploaded_by = auth.uid()::text);
