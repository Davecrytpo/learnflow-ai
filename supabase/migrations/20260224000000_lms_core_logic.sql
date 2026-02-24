-- LMS Core Realization Migration

-- 1. Status Enums
DO $$ BEGIN
    CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enhanced Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status public.approval_status DEFAULT 'approved';
-- Note: Admin will manually set instructor status to 'approved' after registration.

-- 3. Enhanced Enrollments (Multi-step approval)
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS instructor_approved boolean DEFAULT false;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS admin_approved boolean DEFAULT false;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS status public.approval_status DEFAULT 'pending';

-- 4. Certificates Verification
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS verification_code text UNIQUE DEFAULT gen_random_uuid()::text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS status text DEFAULT 'valid';

-- 5. Webinars System
CREATE TABLE IF NOT EXISTS public.webinars (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    instructor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time timestamptz NOT NULL,
    zoom_link text,
    is_recorded boolean DEFAULT false,
    recording_url text,
    created_at timestamptz DEFAULT now()
);

-- 6. News & Announcements
CREATE TABLE IF NOT EXISTS public.news (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'General', -- 'General', 'Academic', 'Course', 'System'
    author_id uuid REFERENCES auth.users(id),
    is_important boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 7. Logic Enforcement (Triggers/Functions)

-- Instructor Course Limit (Max 3)
CREATE OR REPLACE FUNCTION public.check_instructor_course_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.courses WHERE author_id = NEW.author_id) >= 3 THEN
        RAISE EXCEPTION 'Instructors can only create a maximum of 3 courses.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_instructor_course_limit ON public.courses;
CREATE TRIGGER tr_instructor_course_limit
BEFORE INSERT ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.check_instructor_course_limit();

-- Student Enrollment Limit (Max 2)
CREATE OR REPLACE FUNCTION public.check_student_enrollment_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.enrollments WHERE student_id = NEW.student_id AND status != 'rejected') >= 2 THEN
        RAISE EXCEPTION 'Students can only enroll in a maximum of 2 courses.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_student_enrollment_limit ON public.enrollments;
CREATE TRIGGER tr_student_enrollment_limit
BEFORE INSERT ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.check_student_enrollment_limit();

-- 8. Policies
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public news are viewable by everyone" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Webinars are viewable by everyone" ON public.webinars FOR SELECT USING (true);
CREATE POLICY "Instructors and Admins can manage webinars" ON public.webinars FOR ALL 
USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

-- 9. Search Indexing
CREATE INDEX IF NOT EXISTS idx_courses_title_summary ON public.courses USING gin(to_tsvector('english', title || ' ' || coalesce(summary, '')));
