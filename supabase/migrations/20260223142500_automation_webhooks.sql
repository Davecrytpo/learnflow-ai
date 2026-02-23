-- Automation rules and webhooks

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage automation rules" ON public.automation_rules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage webhook configs" ON public.webhook_configs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_automation_rules_status ON public.automation_rules(status);
CREATE INDEX IF NOT EXISTS idx_webhook_configs_status ON public.webhook_configs(status);
