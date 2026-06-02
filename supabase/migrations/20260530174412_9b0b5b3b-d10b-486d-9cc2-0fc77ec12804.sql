CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.page_visits TO anon, authenticated;
GRANT ALL ON public.page_visits TO service_role;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert visits" ON public.page_visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone read visits" ON public.page_visits FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  brief text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert msg" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone read msg" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone update msg" ON public.contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anyone delete msg" ON public.contact_messages FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.portfolio_items (
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
CREATE POLICY "anyone all portfolio" ON public.portfolio_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.branding_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab text NOT NULL CHECK (tab IN ('carousel','gallery')),
  url text NOT NULL,
  caption text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branding_media TO anon, authenticated;
GRANT ALL ON public.branding_media TO service_role;
ALTER TABLE public.branding_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone all branding" ON public.branding_media FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read admin-media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'admin-media');
CREATE POLICY "public upload admin-media" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'admin-media');
CREATE POLICY "public update admin-media" ON storage.objects FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'admin-media');
CREATE POLICY "public delete admin-media" ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'admin-media');