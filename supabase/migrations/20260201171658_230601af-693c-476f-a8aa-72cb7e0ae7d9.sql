-- Create table for blocked chat messages (for moderation)
CREATE TABLE public.blocked_chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_ip TEXT,
  message_content TEXT NOT NULL,
  block_reason TEXT NOT NULL,
  matched_pattern TEXT,
  room_type TEXT NOT NULL DEFAULT 'meeting', -- 'meeting' or 'workspace'
  room_id TEXT,
  workspace_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_chat_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view blocked logs
CREATE POLICY "Admins can view blocked logs"
ON public.blocked_chat_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert (for logging blocked attempts)
CREATE POLICY "Anyone can log blocked messages"
ON public.blocked_chat_logs
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Admins can delete old logs
CREATE POLICY "Admins can delete blocked logs"
ON public.blocked_chat_logs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_blocked_chat_logs_created_at ON public.blocked_chat_logs(created_at DESC);
CREATE INDEX idx_blocked_chat_logs_room_type ON public.blocked_chat_logs(room_type);