-- Categories that drive the home Work section (grid + carousel)
CREATE TABLE public.portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  display_mode text NOT NULL DEFAULT 'carousel' CHECK (display_mode IN ('carousel','grid','both')),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published categories"
  ON public.portfolio_categories FOR SELECT
  USING (published = true);

CREATE POLICY "Admins view all categories"
  ON public.portfolio_categories FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage categories"
  ON public.portfolio_categories FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_portfolio_categories_updated_at
  BEFORE UPDATE ON public.portfolio_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed with the existing 5 categories
INSERT INTO public.portfolio_categories (slug, title, subtitle, image_url, display_order, display_mode) VALUES
  ('graphic-design',   'Graphic Design',   'Visual Identity & Branding',   '/images/project-1.jpg', 1, 'carousel'),
  ('video-production', 'Video Production', 'Motion & Storytelling',        '/images/project-2.jpg', 2, 'carousel'),
  ('ad-campaigns',     'Ad Campaigns',     'Strategic Marketing',          '/images/project-3.jpg', 3, 'carousel'),
  ('web-development',  'Web Development',  'Digital Experiences',          '/images/project-4.jpg', 4, 'carousel'),
  ('photography',      'Photography',      'Light, Composition & Emotion', '/images/project-5.jpg', 5, 'carousel');