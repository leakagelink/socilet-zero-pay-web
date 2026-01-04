-- Drop the existing insert policy
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Create a new policy that allows:
-- 1. Existing admins to insert any role
-- 2. Users to insert their own admin role during signup (for self-registration)
CREATE POLICY "Users can insert their own role or admins can insert any"
ON public.user_roles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)
);