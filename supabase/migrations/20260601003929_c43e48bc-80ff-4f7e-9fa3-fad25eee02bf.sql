-- Align profiles table with the admin/client portal UI
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.profiles
SET
  user_id = COALESCE(user_id, id),
  full_name = COALESCE(full_name, display_name)
WHERE user_id IS NULL OR full_name IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_user_id_key'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profile self read" ON public.profiles;
DROP POLICY IF EXISTS "profile self update" ON public.profiles;
DROP POLICY IF EXISTS "profile self insert" ON public.profiles;

CREATE POLICY "profile self read" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile self update" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = id OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile self insert" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Make signup profile/role creation match the existing profiles table shape
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _default_admin CONSTANT text := 'ouzesof@gmail.com';
  _role public.app_role;
  _name text;
BEGIN
  _name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, user_id, display_name, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.id,
    _name,
    _name,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture')
  )
  ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    email = COALESCE(public.profiles.email, EXCLUDED.email),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  IF lower(NEW.email) = _default_admin THEN
    _role := 'admin';
  ELSE
    _role := 'client';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Page visits
CREATE TABLE IF NOT EXISTS public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL DEFAULT '/',
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.page_visits TO anon, authenticated;
GRANT ALL ON public.page_visits TO service_role;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone insert visits" ON public.page_visits;
CREATE POLICY "anyone insert visits" ON public.page_visits FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone read visits" ON public.page_visits;
CREATE POLICY "anyone read visits" ON public.page_visits FOR SELECT TO anon, authenticated USING (true);

-- Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL DEFAULT '',
  brief text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone insert msg" ON public.contact_messages;
CREATE POLICY "anyone insert msg" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone read msg" ON public.contact_messages;
CREATE POLICY "anyone read msg" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin update msg" ON public.contact_messages;
CREATE POLICY "admin update msg" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin delete msg" ON public.contact_messages;
CREATE POLICY "admin delete msg" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Project',
  description text NOT NULL DEFAULT '',
  cover text,
  media jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read portfolio" ON public.portfolio_items;
CREATE POLICY "public read portfolio" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin insert portfolio" ON public.portfolio_items;
CREATE POLICY "admin insert portfolio" ON public.portfolio_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin update portfolio" ON public.portfolio_items;
CREATE POLICY "admin update portfolio" ON public.portfolio_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin delete portfolio" ON public.portfolio_items;
CREATE POLICY "admin delete portfolio" ON public.portfolio_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Branding media
CREATE TABLE IF NOT EXISTS public.branding_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab text NOT NULL,
  url text NOT NULL,
  caption text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT branding_media_tab_check CHECK (tab IN ('carousel', 'gallery'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branding_media TO anon, authenticated;
GRANT ALL ON public.branding_media TO service_role;
ALTER TABLE public.branding_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read branding" ON public.branding_media;
CREATE POLICY "public read branding" ON public.branding_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin insert branding" ON public.branding_media;
CREATE POLICY "admin insert branding" ON public.branding_media FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin update branding" ON public.branding_media;
CREATE POLICY "admin update branding" ON public.branding_media FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin delete branding" ON public.branding_media;
CREATE POLICY "admin delete branding" ON public.branding_media FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Zoom settings
CREATE TABLE IF NOT EXISTS public.zoom_settings (
  id integer PRIMARY KEY DEFAULT 1,
  zoom_link text,
  meeting_id text,
  passcode text,
  instructions text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT zoom_settings_single_row CHECK (id = 1)
);
GRANT SELECT ON public.zoom_settings TO anon, authenticated;
GRANT UPDATE ON public.zoom_settings TO authenticated;
GRANT ALL ON public.zoom_settings TO service_role;
ALTER TABLE public.zoom_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.zoom_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "anyone read zoom" ON public.zoom_settings;
CREATE POLICY "anyone read zoom" ON public.zoom_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin write zoom" ON public.zoom_settings;
CREATE POLICY "admin write zoom" ON public.zoom_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Zoom bookings
CREATE TABLE IF NOT EXISTS public.zoom_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  client_name text,
  client_email text,
  topic text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zoom_bookings TO authenticated;
GRANT ALL ON public.zoom_bookings TO service_role;
ALTER TABLE public.zoom_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "booking client read" ON public.zoom_bookings;
CREATE POLICY "booking client read" ON public.zoom_bookings FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "booking client insert" ON public.zoom_bookings;
CREATE POLICY "booking client insert" ON public.zoom_bookings FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());
DROP POLICY IF EXISTS "booking admin update" ON public.zoom_bookings;
CREATE POLICY "booking admin update" ON public.zoom_bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "booking admin delete" ON public.zoom_bookings;
CREATE POLICY "booking admin delete" ON public.zoom_bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR client_id = auth.uid());

-- Client projects
CREATE TABLE IF NOT EXISTS public.client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  current_stage text NOT NULL DEFAULT 'discovery',
  progress integer NOT NULL DEFAULT 0,
  stages jsonb NOT NULL DEFAULT '["discovery", "design", "development", "review", "delivered"]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_projects TO authenticated;
GRANT ALL ON public.client_projects TO service_role;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cp client read" ON public.client_projects;
CREATE POLICY "cp client read" ON public.client_projects FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "cp admin all" ON public.client_projects;
CREATE POLICY "cp admin all" ON public.client_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Project messages
CREATE TABLE IF NOT EXISTS public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.client_projects(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  sender_id uuid,
  sender_role text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pm read" ON public.project_messages;
CREATE POLICY "pm read" ON public.project_messages FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "pm insert" ON public.project_messages;
CREATE POLICY "pm insert" ON public.project_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin')));
DROP POLICY IF EXISTS "pm update read" ON public.project_messages;
CREATE POLICY "pm update read" ON public.project_messages FOR UPDATE TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Call sessions
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  room_url text NOT NULL,
  room_name text NOT NULL,
  created_by uuid,
  status text NOT NULL DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.call_sessions TO authenticated;
GRANT ALL ON public.call_sessions TO service_role;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "call read" ON public.call_sessions;
CREATE POLICY "call read" ON public.call_sessions FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "call admin all" ON public.call_sessions;
CREATE POLICY "call admin all" ON public.call_sessions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Realtime for admin messaging/calls
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.project_messages REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Public admin media storage bucket and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read admin-media" ON storage.objects;
CREATE POLICY "public read admin-media" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "admin upload admin-media" ON storage.objects;
CREATE POLICY "admin upload admin-media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'admin-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin update admin-media" ON storage.objects;
CREATE POLICY "admin update admin-media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'admin-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'admin-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin delete admin-media" ON storage.objects;
CREATE POLICY "admin delete admin-media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'admin-media' AND public.has_role(auth.uid(), 'admin'));

-- Make sure the known admin profile has the expected shape
UPDATE public.profiles
SET user_id = id,
    full_name = COALESCE(full_name, display_name, 'ouzesof'),
    email = COALESCE(email, 'ouzesof@gmail.com'),
    updated_at = now()
WHERE id = 'a2130611-2566-4230-a432-86ef0a806af1'::uuid;

INSERT INTO public.user_roles (user_id, role)
VALUES ('a2130611-2566-4230-a432-86ef0a806af1'::uuid, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;