-- Restrict blocked_chat_logs: remove anon access, keep authenticated only
DROP POLICY IF EXISTS "Anyone can log blocked messages" ON public.blocked_chat_logs;
CREATE POLICY "Authenticated users can log blocked messages" ON public.blocked_chat_logs FOR INSERT TO authenticated WITH CHECK (true);
