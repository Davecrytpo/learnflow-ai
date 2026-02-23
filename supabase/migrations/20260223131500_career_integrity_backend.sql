-- Career, integrity, and enterprise support tables

-- Mentorship requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goals TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Job posts
CREATE TABLE IF NOT EXISTS public.job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- Job applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Proctoring sessions
CREATE TABLE IF NOT EXISTS public.proctoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  incidents JSONB,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.proctoring_sessions ENABLE ROW LEVEL SECURITY;

-- Integrity cases
CREATE TABLE IF NOT EXISTS public.integrity_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  issue TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.integrity_cases ENABLE ROW LEVEL SECURITY;

-- Portfolio reviews
CREATE TABLE IF NOT EXISTS public.portfolio_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id),
  artifact_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_reviews ENABLE ROW LEVEL SECURITY;

-- Coaching sessions
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  focus TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Office hours slots
CREATE TABLE IF NOT EXISTS public.office_hours_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode TEXT NOT NULL DEFAULT 'virtual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.office_hours_slots ENABLE ROW LEVEL SECURITY;

-- Employer connections
CREATE TABLE IF NOT EXISTS public.employer_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open_roles',
  open_roles INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.employer_connections ENABLE ROW LEVEL SECURITY;

-- Alumni profiles
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

-- Capstone milestones
CREATE TABLE IF NOT EXISTS public.capstone_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.capstone_milestones ENABLE ROW LEVEL SECURITY;

-- Purchases
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'paid',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Accreditation evidence
CREATE TABLE IF NOT EXISTS public.accreditation_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard TEXT NOT NULL,
  artifact_title TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.accreditation_evidence ENABLE ROW LEVEL SECURITY;

-- Updated_at triggers where needed
CREATE TRIGGER update_mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON public.job_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies
CREATE POLICY "Students manage own mentorship requests" ON public.mentorship_requests
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Anyone can view open job posts" ON public.job_posts
  FOR SELECT USING (status = 'open');
CREATE POLICY "Admins manage job posts" ON public.job_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students manage own applications" ON public.job_applications
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Admins view applications" ON public.job_applications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own proctoring sessions" ON public.proctoring_sessions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());
CREATE POLICY "Instructors view course proctoring sessions" ON public.proctoring_sessions
  FOR SELECT TO authenticated
  USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create proctoring sessions" ON public.proctoring_sessions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_course_author(auth.uid(), course_id));

CREATE POLICY "Instructors view course integrity cases" ON public.integrity_cases
  FOR SELECT TO authenticated
  USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage integrity cases" ON public.integrity_cases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own portfolio reviews" ON public.portfolio_reviews
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());
CREATE POLICY "Instructors manage portfolio reviews" ON public.portfolio_reviews
  FOR ALL TO authenticated
  USING (reviewer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (reviewer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own coaching sessions" ON public.coaching_sessions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());
CREATE POLICY "Instructors manage coaching sessions" ON public.coaching_sessions
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors manage own office hours" ON public.office_hours_slots
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view employer connections" ON public.employer_connections
  FOR SELECT USING (true);
CREATE POLICY "Admins manage employer connections" ON public.employer_connections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Alumni profiles viewable" ON public.alumni_profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own alumni profile" ON public.alumni_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students manage own capstone milestones" ON public.capstone_milestones
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students view own purchases" ON public.purchases
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());
CREATE POLICY "Admins manage purchases" ON public.purchases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors and admins manage accreditation evidence" ON public.accreditation_evidence
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_student ON public.mentorship_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON public.job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_student ON public.job_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_sessions_course ON public.proctoring_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_integrity_cases_course ON public.integrity_cases(course_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_reviews_student ON public.portfolio_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_instructor ON public.coaching_sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_office_hours_instructor ON public.office_hours_slots(instructor_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_user ON public.alumni_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_capstone_milestones_student ON public.capstone_milestones(student_id);
CREATE INDEX IF NOT EXISTS idx_purchases_student ON public.purchases(student_id);
