
-- Enhanced profiles: add education fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS institution TEXT,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS subject_areas TEXT[],
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Quizzes table (exercises, quizzes, tests, exams)
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  quiz_type TEXT NOT NULL DEFAULT 'quiz' CHECK (quiz_type IN ('exercise', 'quiz', 'test', 'exam')),
  time_limit_minutes INTEGER,
  passing_score INTEGER NOT NULL DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  "order" INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewable if course accessible" ON public.quizzes FOR SELECT
USING (
  (published = true AND EXISTS (SELECT 1 FROM courses WHERE courses.id = quizzes.course_id AND courses.published = true))
  OR is_course_author(auth.uid(), course_id)
  OR is_enrolled(auth.uid(), course_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authors can manage quizzes" ON public.quizzes FOR INSERT
WITH CHECK (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can update quizzes" ON public.quizzes FOR UPDATE
USING (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can delete quizzes" ON public.quizzes FOR DELETE
USING (is_course_author(auth.uid(), course_id) OR has_role(auth.uid(), 'admin'::app_role));

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_course_id_for_quiz(_quiz_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT course_id FROM public.quizzes WHERE id = _quiz_id LIMIT 1;
$$;

CREATE POLICY "Viewable if quiz accessible" ON public.quiz_questions FOR SELECT
USING (
  is_course_author(auth.uid(), get_course_id_for_quiz(quiz_id))
  OR is_enrolled(auth.uid(), get_course_id_for_quiz(quiz_id))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authors can manage questions" ON public.quiz_questions FOR INSERT
WITH CHECK (is_course_author(auth.uid(), get_course_id_for_quiz(quiz_id)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can update questions" ON public.quiz_questions FOR UPDATE
USING (is_course_author(auth.uid(), get_course_id_for_quiz(quiz_id)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can delete questions" ON public.quiz_questions FOR DELETE
USING (is_course_author(auth.uid(), get_course_id_for_quiz(quiz_id)) OR has_role(auth.uid(), 'admin'::app_role));

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  score INTEGER,
  total_points INTEGER,
  passed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Authors can view course attempts" ON public.quiz_attempts FOR SELECT
USING (is_course_author(auth.uid(), get_course_id_for_quiz(quiz_id)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled users can create attempts" ON public.quiz_attempts FOR INSERT
WITH CHECK (user_id = auth.uid() AND is_enrolled(auth.uid(), get_course_id_for_quiz(quiz_id)));

CREATE POLICY "Users can update own attempts" ON public.quiz_attempts FOR UPDATE
USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
