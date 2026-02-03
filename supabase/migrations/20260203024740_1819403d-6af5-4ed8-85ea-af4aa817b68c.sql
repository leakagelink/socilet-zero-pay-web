-- Create meeting_participants table to track active participants with names
CREATE TABLE public.meeting_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_room_name TEXT NOT NULL,
  agora_uid TEXT NOT NULL,
  user_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(meeting_room_name, agora_uid)
);

-- Enable RLS
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read participants (for displaying names)
CREATE POLICY "Anyone can view meeting participants"
ON public.meeting_participants
FOR SELECT
USING (true);

-- Allow anyone to insert/update their own participant record
CREATE POLICY "Anyone can join meetings"
ON public.meeting_participants
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their participant status"
ON public.meeting_participants
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can leave meetings"
ON public.meeting_participants
FOR DELETE
USING (true);

-- Enable realtime for participants
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_participants;

-- Create index for faster lookups
CREATE INDEX idx_meeting_participants_room ON public.meeting_participants(meeting_room_name, is_active);