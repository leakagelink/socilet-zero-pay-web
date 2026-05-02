-- 1. Fix saved_payment_methods: restrict policy to authenticated role
DROP POLICY IF EXISTS "Admins can manage saved payment methods" ON public.saved_payment_methods;

CREATE POLICY "Admins can manage saved payment methods"
ON public.saved_payment_methods
AS PERMISSIVE
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. Remove overly permissive DELETE policy on workspace-files storage bucket
DROP POLICY IF EXISTS "Authenticated users can delete workspace files" ON storage.objects;

-- 3. Add RLS policies on realtime.messages so only authenticated users can subscribe
-- (matches the existing posture of chat_messages, workspace_messages, etc.)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'realtime' AND tablename = 'messages'
  ) THEN
    EXECUTE 'ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY';

    -- Drop any prior policy of the same name to make this idempotent
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can receive broadcasts" ON realtime.messages';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can send broadcasts" ON realtime.messages';

    EXECUTE $p$
      CREATE POLICY "Authenticated users can receive broadcasts"
      ON realtime.messages
      FOR SELECT
      TO authenticated
      USING (true)
    $p$;

    EXECUTE $p$
      CREATE POLICY "Authenticated users can send broadcasts"
      ON realtime.messages
      FOR INSERT
      TO authenticated
      WITH CHECK (true)
    $p$;
  END IF;
END $$;