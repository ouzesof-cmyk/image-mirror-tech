
-- =========== ROLES ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

CREATE TABLE public.user_roles (
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
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile self read" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profile self update" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profile self insert" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile + client role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== ZOOM SETTINGS ===========
CREATE TABLE public.zoom_settings (
  id INT PRIMARY KEY DEFAULT 1,
  zoom_link TEXT,
  meeting_id TEXT,
  passcode TEXT,
  instructions TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO public.zoom_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT ON public.zoom_settings TO authenticated, anon;
GRANT ALL ON public.zoom_settings TO service_role;
ALTER TABLE public.zoom_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read zoom" ON public.zoom_settings FOR SELECT USING (true);
CREATE POLICY "admin write zoom" ON public.zoom_settings
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========== ZOOM BOOKINGS ===========
CREATE TABLE public.zoom_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT,
  client_email TEXT,
  topic TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zoom_bookings TO authenticated;
GRANT ALL ON public.zoom_bookings TO service_role;
ALTER TABLE public.zoom_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking client read" ON public.zoom_bookings
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "booking client insert" ON public.zoom_bookings
FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());
CREATE POLICY "booking admin update" ON public.zoom_bookings
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "booking admin delete" ON public.zoom_bookings
FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin') OR client_id = auth.uid());

-- =========== CLIENT PROJECTS ===========
CREATE TABLE public.client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  current_stage TEXT NOT NULL DEFAULT 'discovery',
  progress INT NOT NULL DEFAULT 0,
  stages JSONB NOT NULL DEFAULT '["discovery","design","development","review","delivered"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_projects TO authenticated;
GRANT ALL ON public.client_projects TO service_role;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp client read" ON public.client_projects
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "cp admin all" ON public.client_projects
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========== PROJECT MESSAGES ===========
CREATE TABLE public.project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.client_projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm read" ON public.project_messages
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "pm insert" ON public.project_messages
FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
);
CREATE POLICY "pm update read" ON public.project_messages
FOR UPDATE TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
ALTER TABLE public.project_messages REPLICA IDENTITY FULL;

-- =========== CALL SESSIONS ===========
CREATE TABLE public.call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_url TEXT NOT NULL,
  room_name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.call_sessions TO authenticated;
GRANT ALL ON public.call_sessions TO service_role;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "call read" ON public.call_sessions
FOR SELECT TO authenticated USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "call admin all" ON public.call_sessions
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
