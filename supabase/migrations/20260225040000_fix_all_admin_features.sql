-- Fix all Admin Dashboard features and relationships

-- 1. Fix Courses -> Profiles Relationship
-- We need a FK on author_id pointing to profiles(user_id) to allow PostgREST joins like:
-- select("*, profiles:author_id(display_name)")
-- However, author_id already references auth.users. PostgreSQL allows multiple FKs on the same column.
-- But profiles.user_id must be unique (it is).
ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_author_id_fkey_profiles;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_author_id_fkey_profiles
  FOREIGN KEY (author_id)
  REFERENCES public.profiles(user_id)
  ON DELETE CASCADE;

-- 2. Create Tables for all Admin "Shell" Pages

-- Accreditation
CREATE TABLE IF NOT EXISTS public.accreditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  renewal_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.accreditations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage accreditations" ON public.accreditations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Compliance
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'compliant',
  last_audit TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage compliance" ON public.compliance_records FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Marketplace Listings
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage marketplace" ON public.marketplace_listings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AI Governance
CREATE TABLE IF NOT EXISTS public.ai_governance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  request_type TEXT,
  status TEXT DEFAULT 'approved',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_governance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage ai logs" ON public.ai_governance_logs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Data Exports
CREATE TABLE IF NOT EXISTS public.data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  format TEXT DEFAULT 'csv',
  status TEXT DEFAULT 'completed',
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage exports" ON public.data_exports FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Proctoring
CREATE TABLE IF NOT EXISTS public.proctoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  exam_id UUID, 
  status TEXT DEFAULT 'live',
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.proctoring_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage proctoring" ON public.proctoring_sessions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Plagiarism
CREATE TABLE IF NOT EXISTS public.plagiarism_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  assignment_id UUID,
  similarity_score DECIMAL(5, 2),
  status TEXT DEFAULT 'investigating',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.plagiarism_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage plagiarism" ON public.plagiarism_cases FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Data Pipelines
CREATE TABLE IF NOT EXISTS public.data_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source TEXT,
  destination TEXT,
  status TEXT DEFAULT 'active',
  last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.data_pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pipelines" ON public.data_pipelines FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Commerce / Marketplace Orders
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id),
  buyer_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2),
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage orders" ON public.marketplace_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- SSO Providers
CREATE TABLE IF NOT EXISTS public.sso_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  protocol TEXT DEFAULT 'SAML',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sso_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sso" ON public.sso_providers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Directory Sync
CREATE TABLE IF NOT EXISTS public.directory_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT DEFAULT 'synced',
  last_sync TIMESTAMPTZ DEFAULT now(),
  users_synced INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.directory_syncs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage directory sync" ON public.directory_syncs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage support" ON public.support_tickets FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Advanced Analytics (Just a bucket for aggregate data if needed, or we query live)
-- Cohort Insights
CREATE TABLE IF NOT EXISTS public.cohort_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name TEXT NOT NULL,
  engagement_score INTEGER,
  retention_rate INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cohort_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage cohorts" ON public.cohort_insights FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Multi-Campus
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage campuses" ON public.campuses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Catalog Segmentation
CREATE TABLE IF NOT EXISTS public.catalog_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rule_set TEXT,
  course_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.catalog_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage segments" ON public.catalog_segments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seed some initial data to avoid "empty" looking pages
INSERT INTO public.accreditations (agency, status) VALUES ('AACSB', 'active'), ('ABET', 'review');
INSERT INTO public.compliance_records (title, status) VALUES ('GDPR Audit', 'compliant'), ('FERPA Review', 'pending');
INSERT INTO public.marketplace_listings (title, price, provider) VALUES ('Python Masterclass', 199.99, 'CodingAcademy');
INSERT INTO public.ai_governance_logs (model, request_type) VALUES ('GPT-4', 'content_gen');
INSERT INTO public.data_exports (name, format) VALUES ('Q1_Enrollments', 'csv');
INSERT INTO public.data_pipelines (name, source) VALUES ('Canvas Sync', 'LMS_Canvas');
INSERT INTO public.sso_providers (name, protocol) VALUES ('Azure AD', 'SAML');
INSERT INTO public.directory_syncs (source, users_synced) VALUES ('Active Directory', 1250);
INSERT INTO public.campuses (name, location) VALUES ('Main Campus', 'New York');
INSERT INTO public.catalog_segments (name, rule_set) VALUES ('Engineering', 'category=eng');
