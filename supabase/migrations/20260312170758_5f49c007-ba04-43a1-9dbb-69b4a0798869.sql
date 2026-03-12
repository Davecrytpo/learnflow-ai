
-- Add status column to enrollments (many queries filter by status)
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

-- Add status column to profiles (used for instructor approval flow)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text;

-- Create course_resources table
CREATE TABLE IF NOT EXISTS public.course_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'link',
  module_id uuid REFERENCES public.modules(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors can manage resources" ON public.course_resources FOR ALL
  USING (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled can view resources" ON public.course_resources FOR SELECT
  USING (is_enrolled(auth.uid(), course_id) OR is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

-- Create course_groups table
CREATE TABLE IF NOT EXISTS public.course_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors can manage groups" ON public.course_groups FOR ALL
  USING (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled can view groups" ON public.course_groups FOR SELECT
  USING (is_enrolled(auth.uid(), course_id) OR is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));
