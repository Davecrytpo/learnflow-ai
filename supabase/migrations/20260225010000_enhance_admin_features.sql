-- Migration to enhance Admin features: Categories, Settings, and robust Reporting

-- 1. Course Categories Table
CREATE TABLE IF NOT EXISTS public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

-- 2. System Settings Table (for site-wide config)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Categories: Public read, Admin write
CREATE POLICY "Categories are viewable by everyone" 
  ON public.course_categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage categories" 
  ON public.course_categories FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Settings: Admin read/write only (some might be public via a function if needed later)
CREATE POLICY "Admins can manage system settings" 
  ON public.system_settings FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 4. Insert Default Categories
INSERT INTO public.course_categories (name, slug, description) VALUES
('General', 'general', 'General purpose courses'),
('Technology', 'technology', 'Software, Hardware, and IT'),
('Business', 'business', 'Management, Finance, and Strategy'),
('Arts & Humanities', 'arts-humanities', 'History, Literature, and Philosophy')
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Default Settings
INSERT INTO public.system_settings (key, value, description) VALUES
('site_info', '{"name": "Learnflow AI", "description": "Enterprise LMS"}'::jsonb, 'General site information'),
('registration', '{"open": true, "require_approval": false}'::jsonb, 'User registration settings'),
('appearance', '{"theme": "light", "primary_color": "#0f172a"}'::jsonb, 'Default visual settings')
ON CONFLICT (key) DO NOTHING;

-- 6. Trigger for updated_at
CREATE TRIGGER update_course_categories_updated_at
  BEFORE UPDATE ON public.course_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
