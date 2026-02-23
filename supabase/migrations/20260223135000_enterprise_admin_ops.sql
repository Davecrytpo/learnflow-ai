-- Enterprise admin operations tables

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- SSO providers
CREATE TABLE IF NOT EXISTS public.sso_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'saml',
  status TEXT NOT NULL DEFAULT 'connected',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sso_providers ENABLE ROW LEVEL SECURITY;

-- Directory sync connectors
CREATE TABLE IF NOT EXISTS public.directory_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_sync TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.directory_connectors ENABLE ROW LEVEL SECURITY;

-- Branding themes
CREATE TABLE IF NOT EXISTS public.brand_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brand_themes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins manage support tickets" ON public.support_tickets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage sso providers" ON public.sso_providers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage directory connectors" ON public.directory_connectors
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage brand themes" ON public.brand_themes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_sso_providers_status ON public.sso_providers(status);
CREATE INDEX IF NOT EXISTS idx_directory_connectors_status ON public.directory_connectors(status);
