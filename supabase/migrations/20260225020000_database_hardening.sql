
-- 1. Ensure enrollments has the status and approval columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='status') THEN
    ALTER TABLE public.enrollments ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='instructor_approved') THEN
    ALTER TABLE public.enrollments ADD COLUMN instructor_approved BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='admin_approved') THEN
    ALTER TABLE public.enrollments ADD COLUMN admin_approved BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 2. Ensure Audit Logs exists
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT, -- Changed to text to support varied ID types
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Ensure Course Categories exists
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

-- 4. Ensure Webhook Configs exists
CREATE TABLE IF NOT EXISTS public.webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  endpoint TEXT NOT NULL,
  events TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;

-- 5. Ensure System Settings exists
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 6. Re-apply essential policies to ensure they exist on remote
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.course_categories;
CREATE POLICY "Categories are viewable by everyone" ON public.course_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.course_categories;
CREATE POLICY "Admins can manage categories" ON public.course_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage webhook configs" ON public.webhook_configs;
CREATE POLICY "Admins manage webhook configs" ON public.webhook_configs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 8. Ensure Tenants exists
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  plan TEXT DEFAULT 'growth',
  status TEXT DEFAULT 'active',
  seats INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage tenants" ON public.tenants;
CREATE POLICY "Admins manage tenants" ON public.tenants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Default tenant
INSERT INTO public.tenants (name, slug, plan, status, seats) 
VALUES ('Global University Institute', 'gui', 'enterprise', 'active', 10000)
ON CONFLICT (slug) DO NOTHING;
