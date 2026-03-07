-- Add mission-critical university fields to courses table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='level') THEN
    ALTER TABLE public.courses ADD COLUMN level TEXT DEFAULT 'Undergraduate' CHECK (level IN ('Undergraduate', 'Graduate', 'Doctoral', 'Certificate', 'Online'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='credits') THEN
    ALTER TABLE public.courses ADD COLUMN credits INTEGER DEFAULT 3;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='duration') THEN
    ALTER TABLE public.courses ADD COLUMN duration TEXT DEFAULT '12 Weeks';
  END IF;

  -- Ensure status has correct constraints for accreditation
  ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_status_check;
  ALTER TABLE public.courses ADD CONSTRAINT courses_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'draft'));
END $$;

-- Update RLS for course management
CREATE POLICY "Admins can manage all courses" ON public.courses 
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Ensure instructors can only edit their own courses if they aren't published or if they are admins
CREATE POLICY "Instructors manage own courses" ON public.courses 
  FOR UPDATE TO authenticated USING (author_id = auth.uid() AND (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin')));
