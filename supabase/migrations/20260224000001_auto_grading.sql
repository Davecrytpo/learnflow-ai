-- Auto-grading and News Extensions

-- 1. Newsletter Table
CREATE TABLE IF NOT EXISTS public.newsletter_subs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_subs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subs" ON public.newsletter_subs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 2. Grades Table (Consolidated)
CREATE TABLE IF NOT EXISTS public.grades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    item_type text NOT NULL, -- 'quiz', 'assignment', 'exam'
    item_id uuid NOT NULL,
    score numeric NOT NULL,
    max_score numeric NOT NULL,
    feedback text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own grades" ON public.grades FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Instructors/Admins manage grades" ON public.grades FOR ALL USING (
    public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin')
);

-- 3. Auto-grading support function
CREATE OR REPLACE FUNCTION public.calculate_quiz_score(_attempt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _score numeric := 0;
    _total numeric := 0;
    _q record;
    _attempt record;
BEGIN
    SELECT * FROM public.quiz_attempts WHERE id = _attempt_id INTO _attempt;
    
    FOR _q IN SELECT * FROM public.quiz_questions WHERE quiz_id = _attempt.quiz_id LOOP
        _total := _total + _q.points;
        IF _attempt.answers->>(_q.id::text) = _q.correct_answer THEN
            _score := _score + _q.points;
        END IF;
    END LOOP;

    UPDATE public.quiz_attempts 
    SET score = _score, total_points = _total, passed = (_score / _total * 100) >= (SELECT passing_score FROM public.quizzes WHERE id = _attempt.quiz_id)
    WHERE id = _attempt_id;

    -- Update central grades table
    INSERT INTO public.grades (student_id, course_id, item_type, item_id, score, max_score)
    VALUES (
        _attempt.user_id, 
        (SELECT course_id FROM public.quizzes WHERE id = _attempt.quiz_id),
        'quiz',
        _attempt.quiz_id,
        _score,
        _total
    )
    ON CONFLICT (student_id, item_id) DO UPDATE SET score = EXCLUDED.score, updated_at = now();
END;
$$;
