CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- user_roles
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;

CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "profile self read" ON public.profiles;
DROP POLICY IF EXISTS "profile self update" ON public.profiles;
DROP POLICY IF EXISTS "profile self insert" ON public.profiles;

CREATE POLICY "profile self read" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile self update" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = id OR auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile self insert" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- contact messages
DROP POLICY IF EXISTS "admin update msg" ON public.contact_messages;
DROP POLICY IF EXISTS "admin delete msg" ON public.contact_messages;
CREATE POLICY "admin update msg" ON public.contact_messages
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete msg" ON public.contact_messages
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- portfolio
DROP POLICY IF EXISTS "admin insert portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "admin update portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "admin delete portfolio" ON public.portfolio_items;
CREATE POLICY "admin insert portfolio" ON public.portfolio_items
FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update portfolio" ON public.portfolio_items
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete portfolio" ON public.portfolio_items
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- branding media
DROP POLICY IF EXISTS "admin insert branding" ON public.branding_media;
DROP POLICY IF EXISTS "admin update branding" ON public.branding_media;
DROP POLICY IF EXISTS "admin delete branding" ON public.branding_media;
CREATE POLICY "admin insert branding" ON public.branding_media
FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update branding" ON public.branding_media
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete branding" ON public.branding_media
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

-- zoom settings and bookings
DROP POLICY IF EXISTS "admin write zoom" ON public.zoom_settings;
CREATE POLICY "admin write zoom" ON public.zoom_settings
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "booking client read" ON public.zoom_bookings;
DROP POLICY IF EXISTS "booking admin update" ON public.zoom_bookings;
CREATE POLICY "booking client read" ON public.zoom_bookings
FOR SELECT TO authenticated
USING (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "booking admin update" ON public.zoom_bookings
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- client projects
DROP POLICY IF EXISTS "cp client read" ON public.client_projects;
DROP POLICY IF EXISTS "cp admin all" ON public.client_projects;
CREATE POLICY "cp client read" ON public.client_projects
FOR SELECT TO authenticated
USING (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "cp admin all" ON public.client_projects
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- project messages
DROP POLICY IF EXISTS "pm read" ON public.project_messages;
DROP POLICY IF EXISTS "pm insert" ON public.project_messages;
DROP POLICY IF EXISTS "pm update read" ON public.project_messages;
CREATE POLICY "pm read" ON public.project_messages
FOR SELECT TO authenticated
USING (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "pm insert" ON public.project_messages
FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin')));
CREATE POLICY "pm update read" ON public.project_messages
FOR UPDATE TO authenticated
USING (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));

-- call sessions
DROP POLICY IF EXISTS "call read" ON public.call_sessions;
DROP POLICY IF EXISTS "call admin all" ON public.call_sessions;
CREATE POLICY "call read" ON public.call_sessions
FOR SELECT TO authenticated
USING (client_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "call admin all" ON public.call_sessions
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- Keep public helper non-callable; policies now use private.has_role.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;