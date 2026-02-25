-- University LMS Specification Migration for Global University Institute

-- 1. Courses Table Updates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='status') THEN
    ALTER TABLE public.courses ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
  
  -- Ensure created_by/author_id exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='author_id') THEN
    ALTER TABLE public.courses ADD COLUMN author_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- 2. Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections viewable by enrolled students" ON public.sections 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = sections.course_id AND student_id = auth.uid() AND status = 'approved')
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.course_instructors WHERE course_id = sections.course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Instructors manage own sections" ON public.sections 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.course_instructors WHERE course_id = sections.course_id AND instructor_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- 3. Lessons Table Updates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='section_id') THEN
    ALTER TABLE public.lessons ADD COLUMN section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='lesson_type') THEN
    ALTER TABLE public.lessons ADD COLUMN lesson_type TEXT DEFAULT 'content'; -- video, slides, file, content
  END IF;
END $$;

-- 4. Course Instructors (Junction Table)
CREATE TABLE IF NOT EXISTS public.course_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, instructor_id)
);
ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage instructor assignments" ON public.course_instructors 
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors view own assignments" ON public.course_instructors 
  FOR SELECT USING (instructor_id = auth.uid());

-- 5. Enrollment Status Sync
-- Ensure enrollments has status: 'pending', 'approved', 'rejected'
DO $$ 
BEGIN
  -- We already have status in previous hardening, but let's ensure constraints
  ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
  ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
END $$;

-- 6. Trigger for Section order
CREATE OR REPLACE FUNCTION public.update_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_modtime 
  BEFORE UPDATE ON public.sections 
  FOR EACH ROW EXECUTE FUNCTION public.update_section_updated_at();
