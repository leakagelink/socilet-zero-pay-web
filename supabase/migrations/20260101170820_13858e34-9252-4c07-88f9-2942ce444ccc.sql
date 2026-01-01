-- Fix user_roles RLS policies - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix referrals RLS policies - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Affiliates can view their own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Affiliates can insert their own referrals" ON public.referrals;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Affiliates can view their own referrals"
ON public.referrals
FOR SELECT
TO authenticated
USING (affiliate_id IN (SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can insert their own referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (affiliate_id IN (SELECT id FROM public.affiliate_users WHERE user_id = auth.uid()));