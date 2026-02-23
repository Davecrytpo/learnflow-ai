-- Reporting and export schedules

CREATE TABLE IF NOT EXISTS public.report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name TEXT NOT NULL,
  cadence TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.export_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_name TEXT NOT NULL,
  cadence TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.export_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage report schedules" ON public.report_schedules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage export schedules" ON public.export_schedules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_report_schedules_status ON public.report_schedules(status);
CREATE INDEX IF NOT EXISTS idx_export_schedules_status ON public.export_schedules(status);
