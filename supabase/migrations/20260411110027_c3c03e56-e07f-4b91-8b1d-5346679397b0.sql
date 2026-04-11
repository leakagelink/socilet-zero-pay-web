
-- 1. REFERRALS: Security definer function already created in previous migration
-- Now update the app to use specific column selection instead of select('*')

-- 2. USER_ROLES: Add unique constraint and UPDATE policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. REALTIME: Remove sensitive admin-only tables from realtime publication
-- Use DROP TABLE without IF EXISTS (valid syntax)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['projects','digital_products','recurring_earnings','other_income','spends','cosmofeed_sales'])
  LOOP
    IF EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = tbl AND schemaname = 'public'
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime DROP TABLE public.%I', tbl);
    END IF;
  END LOOP;
END $$;

-- 4. MEETING_PARTICIPANTS: meeting_participants has no auth.uid() column link
-- agora_uid is SDK-generated, not tied to auth. Keep existing authenticated-only policies.
-- This is acceptable given the collaborative meeting context.
