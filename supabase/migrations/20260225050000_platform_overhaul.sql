-- Migration for Platform Overhaul: Student & Instructor Specialized Profiles

-- 1. Student Profiles (for Learning Personality & Goals)
CREATE TABLE IF NOT EXISTS public.student_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_goals TEXT[], -- e.g., ['Get a job', 'Upgrade skills']
  learning_preference TEXT, -- e.g., 'Video-based', 'Live classes'
  proficiency_level TEXT, -- e.g., 'Beginner', 'Intermediate'
  interests TEXT[], -- e.g., ['Coding', 'Design']
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own student profile" ON public.student_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own student profile" ON public.student_profiles 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own student profile" ON public.student_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all student profiles" ON public.student_profiles 
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 2. Instructor Profiles (for Qualification & Verification)
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_url TEXT,
  experience_years INTEGER,
  teaching_formats TEXT[], -- e.g., ['Recorded', 'Live', 'Hybrid']
  sample_video_url TEXT,
  verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  earnings_balance DECIMAL(10, 2) DEFAULT 0.00,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  badges TEXT[], -- e.g., ['Verified', 'Expert']
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view approved instructors" ON public.instructor_profiles 
  FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users view own instructor profile" ON public.instructor_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own instructor profile" ON public.instructor_profiles 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own instructor profile" ON public.instructor_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage instructor profiles" ON public.instructor_profiles 
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3. Tutor Requests (Learning Match System)
CREATE TABLE IF NOT EXISTS public.tutor_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  budget_range TEXT, -- e.g. "$20-$50/hr"
  schedule_pref TEXT, -- e.g. "Weekends"
  status TEXT DEFAULT 'open', -- open, matched, closed
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.tutor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own requests" ON public.tutor_requests 
  FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Instructors view open requests" ON public.tutor_requests 
  FOR SELECT USING (status = 'open' AND public.has_role(auth.uid(), 'instructor'));
CREATE POLICY "Admins manage requests" ON public.tutor_requests 
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Triggers for updated_at
CREATE TRIGGER update_student_profiles_modtime 
  BEFORE UPDATE ON public.student_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instructor_profiles_modtime 
  BEFORE UPDATE ON public.instructor_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
