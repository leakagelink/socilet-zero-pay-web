-- Create storage bucket for workspace files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('workspace-files', 'workspace-files', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload files to workspace-files bucket
CREATE POLICY "Anyone can upload workspace files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workspace-files');

-- Allow anyone to view workspace files
CREATE POLICY "Anyone can view workspace files"
ON storage.objects FOR SELECT
USING (bucket_id = 'workspace-files');

-- Allow anyone to delete their uploaded files
CREATE POLICY "Anyone can delete workspace files"
ON storage.objects FOR DELETE
USING (bucket_id = 'workspace-files');