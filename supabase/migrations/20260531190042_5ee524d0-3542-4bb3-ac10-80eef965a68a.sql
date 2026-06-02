
-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'client');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;
CREATE POLICY "admin manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT, avatar_url TEXT, email TEXT, phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profile self read" ON public.profiles;
CREATE POLICY "profile self read" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "profile self update" ON public.profiles;
CREATE POLICY "profile self update" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "profile self insert" ON public.profiles;
CREATE POLICY "profile self insert" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _default_admin CONSTANT text := 'ouzesof@gmail.com';
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO NOTHING;
  IF lower(NEW.email) = _default_admin THEN _role := 'admin'; ELSE _role := 'client'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Page visits
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL DEFAULT '/',
  visitor_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT NOT NULL, service TEXT NOT NULL, brief TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone insert msg" ON public.contact_messages;
CREATE POLICY "anyone insert msg" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone read msg" ON public.contact_messages;
CREATE POLICY "anyone read msg" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone update msg" ON public.contact_messages;
CREATE POLICY "anyone update msg" ON public.contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone delete msg" ON public.contact_messages;
CREATE POLICY "anyone delete msg" ON public.contact_messages FOR DELETE TO anon, authenticated USING (true);

-- Portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT NOT NULL DEFAULT '',
  cover TEXT, media JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone all portfolio" ON public.portfolio_items;
CREATE POLICY "anyone all portfolio" ON public.portfolio_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Branding media
CREATE TABLE IF NOT EXISTS public.branding_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tab TEXT NOT NULL CHECK (tab IN ('carousel','gallery')),
  url TEXT NOT NULL, caption TEXT, position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branding_media TO anon, authenticated;
GRANT ALL ON public.branding_media TO service_role;
ALTER TABLE public.branding_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone all branding" ON public.branding_media;
CREATE POLICY "anyone all branding" ON public.branding_media FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Zoom settings
CREATE TABLE IF NOT EXISTS public.zoom_settings (
  id INT PRIMARY KEY DEFAULT 1,
  zoom_link TEXT, meeting_id TEXT, passcode TEXT, instructions TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO public.zoom_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT ON public.zoom_settings TO authenticated, anon;
GRANT ALL ON public.zoom_settings TO service_role;
ALTER TABLE public.zoom_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read zoom" ON public.zoom_settings;
CREATE POLICY "anyone read zoom" ON public.zoom_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write zoom" ON public.zoom_settings;
CREATE POLICY "admin write zoom" ON public.zoom_settings
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Zoom bookings
CREATE TABLE IF NOT EXISTS public.zoom_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT, client_email TEXT, topic TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zoom_bookings TO authenticated;
GRANT ALL ON public.zoom_bookings TO service_role;
ALTER TABLE public.zoom_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "booking client read" ON public.zoom_bookings;
CREATE POLICY "booking client read" ON public.zoom_bookings
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "booking client insert" ON public.zoom_bookings;
CREATE POLICY "booking client insert" ON public.zoom_bookings
FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());
DROP POLICY IF EXISTS "booking admin update" ON public.zoom_bookings;
CREATE POLICY "booking admin update" ON public.zoom_bookings
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "booking admin delete" ON public.zoom_bookings;
CREATE POLICY "booking admin delete" ON public.zoom_bookings
FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin') OR client_id = auth.uid());

-- Client projects
CREATE TABLE IF NOT EXISTS public.client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, description TEXT, category TEXT,
  current_stage TEXT NOT NULL DEFAULT 'discovery',
  progress INT NOT NULL DEFAULT 0,
  stages JSONB NOT NULL DEFAULT '["discovery","design","development","review","delivered"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_projects TO authenticated;
GRANT ALL ON public.client_projects TO service_role;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cp client read" ON public.client_projects;
CREATE POLICY "cp client read" ON public.client_projects
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "cp admin all" ON public.client_projects;
CREATE POLICY "cp admin all" ON public.client_projects
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Project messages
CREATE TABLE IF NOT EXISTS public.project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.client_projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL, body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pm read" ON public.project_messages;
CREATE POLICY "pm read" ON public.project_messages
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "pm insert" ON public.project_messages;
CREATE POLICY "pm insert" ON public.project_messages
FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND (client_id = auth.uid() OR public.has_role(auth.uid(),'admin')));
DROP POLICY IF EXISTS "pm update read" ON public.project_messages;
CREATE POLICY "pm update read" ON public.project_messages
FOR UPDATE TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Call sessions
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_url TEXT NOT NULL, room_name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.call_sessions TO authenticated;
GRANT ALL ON public.call_sessions TO service_role;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "call read" ON public.call_sessions;
CREATE POLICY "call read" ON public.call_sessions
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "call admin all" ON public.call_sessions;
CREATE POLICY "call admin all" ON public.call_sessions
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE public.project_messages REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "public read admin-media" ON storage.objects;
CREATE POLICY "public read admin-media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'admin-media');
DROP POLICY IF EXISTS "public upload admin-media" ON storage.objects;
CREATE POLICY "public upload admin-media" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'admin-media');
DROP POLICY IF EXISTS "public update admin-media" ON storage.objects;
CREATE POLICY "public update admin-media" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'admin-media');
DROP POLICY IF EXISTS "public delete admin-media" ON storage.objects;
CREATE POLICY "public delete admin-media" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'admin-media');
