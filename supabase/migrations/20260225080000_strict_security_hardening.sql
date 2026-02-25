-- STRICT SECURITY & INTEGRITY HARDENING

-- 1. ENFORCE COURSE VISIBILITY
-- Courses are ONLY visible if published=true AND status='approved'
-- OR if the user is the author or an admin
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Public can view approved courses" ON public.courses 
  FOR SELECT USING (
    (published = true AND status = 'approved')
    OR author_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- 2. ENFORCE ENROLLMENT ACCESS
-- Students can ONLY view content if enrollment status is 'approved'
-- This protects sections and lessons cascadingly
DROP POLICY IF EXISTS "Sections viewable by enrolled students" ON public.sections;
CREATE POLICY "Sections viewable by approved students" ON public.sections 
  FOR SELECT USING (
    (EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE course_id = sections.course_id 
      AND student_id = auth.uid() 
      AND status = 'approved'
    ))
    OR public.has_role(auth.uid(), 'admin')
    OR (EXISTS (SELECT 1 FROM public.courses WHERE id = sections.course_id AND author_id = auth.uid()))
  );

-- 3. AUTO-PENDING ON CREATE
-- When an instructor creates a course, force status to 'pending'
CREATE OR REPLACE FUNCTION public.force_course_pending()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
    NEW.published := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_course_create_pending ON public.courses;
CREATE TRIGGER on_course_create_pending
  BEFORE INSERT ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.force_course_pending();

-- 4. AUTO-PENDING ON ENROLLMENT
-- When a student enrolls, force status to 'pending'
CREATE OR REPLACE FUNCTION public.force_enrollment_pending()
RETURNS TRIGGER AS $$
BEGIN
  -- Admins can enroll students directly as approved
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
    NEW.admin_approved := false;
    NEW.instructor_approved := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enroll_pending ON public.enrollments;
CREATE TRIGGER on_enroll_pending
  BEFORE INSERT ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.force_enrollment_pending();

-- 5. CASCADE DELETION INTEGRITY
-- Ensure deleting a course wipes sections, lessons, and enrollments
-- (Already handled by ON DELETE CASCADE in previous migrations, but reinforcing)
ALTER TABLE public.sections 
  DROP CONSTRAINT IF EXISTS sections_course_id_fkey,
  ADD CONSTRAINT sections_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.lessons 
  DROP CONSTRAINT IF EXISTS lessons_section_id_fkey,
  ADD CONSTRAINT lessons_section_id_fkey 
  FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;

ALTER TABLE public.enrollments 
  DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey,
  ADD CONSTRAINT enrollments_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
