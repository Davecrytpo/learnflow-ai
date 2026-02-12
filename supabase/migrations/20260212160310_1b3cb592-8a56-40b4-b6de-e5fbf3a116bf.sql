
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  price_cents INTEGER DEFAULT 0,
  cover_image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 5. Modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 6. Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- 7. Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_score INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- 8. Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  score INTEGER,
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 9. Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (course_id, student_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 10. Certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cert_url TEXT,
  certificate_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 11. Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 12. Lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- 13. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Security definer helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_course_author(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = _course_id AND author_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE student_id = _user_id AND course_id = _course_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_course_id_for_assignment(_assignment_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT course_id FROM public.assignments WHERE id = _assignment_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_course_id_for_lesson(_lesson_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT course_id FROM public.lessons WHERE id = _lesson_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_course_id_for_module(_module_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT course_id FROM public.modules WHERE id = _module_id LIMIT 1;
$$;

-- 16. RLS Policies

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System creates profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can self-assign student or instructor" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND role IN ('student', 'instructor'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- courses
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (published = true);
CREATE POLICY "Authors and admins can view all own courses" ON public.courses FOR SELECT TO authenticated USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Enrolled students can view course" ON public.courses FOR SELECT TO authenticated USING (public.is_enrolled(auth.uid(), id));
CREATE POLICY "Instructors can create courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Authors can update own courses" ON public.courses FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can delete own courses" ON public.courses FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- modules
CREATE POLICY "Viewable if course accessible" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND published = true)
  OR public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Authors can manage modules" ON public.modules FOR INSERT TO authenticated WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can update modules" ON public.modules FOR UPDATE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can delete modules" ON public.modules FOR DELETE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

-- lessons
CREATE POLICY "Viewable if course accessible" ON public.lessons FOR SELECT USING (
  (published = true AND EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND published = true))
  OR public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Authors can manage lessons" ON public.lessons FOR INSERT TO authenticated WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can update lessons" ON public.lessons FOR UPDATE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can delete lessons" ON public.lessons FOR DELETE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

-- assignments
CREATE POLICY "Viewable if course accessible" ON public.assignments FOR SELECT USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Authors can manage assignments" ON public.assignments FOR INSERT TO authenticated WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can update assignments" ON public.assignments FOR UPDATE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can delete assignments" ON public.assignments FOR DELETE TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

-- submissions
CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Instructors can view course submissions" ON public.submissions FOR SELECT TO authenticated USING (
  public.is_course_author(auth.uid(), public.get_course_id_for_assignment(assignment_id))
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Students can submit" ON public.submissions FOR INSERT TO authenticated WITH CHECK (
  student_id = auth.uid()
  AND public.is_enrolled(auth.uid(), public.get_course_id_for_assignment(assignment_id))
);
CREATE POLICY "Instructors can grade" ON public.submissions FOR UPDATE TO authenticated USING (
  public.is_course_author(auth.uid(), public.get_course_id_for_assignment(assignment_id))
  OR public.has_role(auth.uid(), 'admin')
);

-- enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Authors can view course enrollments" ON public.enrollments FOR SELECT TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can enroll" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own enrollment" ON public.enrollments FOR UPDATE TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- certificates
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all certificates" ON public.certificates FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- lesson_progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Authors can view course progress" ON public.lesson_progress FOR SELECT TO authenticated USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can track own progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_enrolled(auth.uid(), course_id));
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 17. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('course-covers', 'course-covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-files', 'lesson-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Public can view course covers" ON storage.objects FOR SELECT USING (bucket_id = 'course-covers');
CREATE POLICY "Authenticated can upload course covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'course-covers');
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Authenticated can view lesson files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'lesson-files');
CREATE POLICY "Authenticated can upload lesson files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'lesson-files');
CREATE POLICY "Authenticated can view submissions" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'submissions');
CREATE POLICY "Authenticated can upload submissions" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'submissions');

-- 18. Indexes
CREATE INDEX idx_courses_author ON public.courses(author_id);
CREATE INDEX idx_courses_published ON public.courses(published);
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_modules_course ON public.modules(course_id);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_assignments_course ON public.assignments(course_id);
CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
