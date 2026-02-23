-- Backend hardening and access control improvements

-- Helper: get course_id from discussion
CREATE OR REPLACE FUNCTION public.get_course_id_for_discussion(_discussion_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT course_id FROM public.discussions WHERE id = _discussion_id LIMIT 1;
$$;

-- Discussions: tighten access to enrolled users and course staff
DROP POLICY IF EXISTS "Public discussions are viewable by everyone" ON public.discussions;
DROP POLICY IF EXISTS "Users can create discussions if authenticated" ON public.discussions;
DROP POLICY IF EXISTS "Users can update their own discussions" ON public.discussions;
DROP POLICY IF EXISTS "Users can delete their own discussions" ON public.discussions;

CREATE POLICY "Course discussions are viewable by enrolled users"
ON public.discussions FOR SELECT
USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create discussions for enrolled courses"
ON public.discussions FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.is_course_author(auth.uid(), course_id)
    OR public.is_enrolled(auth.uid(), course_id)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can update their discussions"
ON public.discussions FOR UPDATE
USING (
  auth.uid() = user_id
  OR public.is_course_author(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can delete their discussions"
ON public.discussions FOR DELETE
USING (
  auth.uid() = user_id
  OR public.is_course_author(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Discussion replies: tighten access
DROP POLICY IF EXISTS "Public replies are viewable by everyone" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can create replies if authenticated" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can update their own replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can delete their own replies" ON public.discussion_replies;

CREATE POLICY "Course replies are viewable by enrolled users"
ON public.discussion_replies FOR SELECT
USING (
  public.is_course_author(auth.uid(), public.get_course_id_for_discussion(discussion_id))
  OR public.is_enrolled(auth.uid(), public.get_course_id_for_discussion(discussion_id))
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create replies for enrolled courses"
ON public.discussion_replies FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.is_course_author(auth.uid(), public.get_course_id_for_discussion(discussion_id))
    OR public.is_enrolled(auth.uid(), public.get_course_id_for_discussion(discussion_id))
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can update their replies"
ON public.discussion_replies FOR UPDATE
USING (
  auth.uid() = user_id
  OR public.is_course_author(auth.uid(), public.get_course_id_for_discussion(discussion_id))
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can delete their replies"
ON public.discussion_replies FOR DELETE
USING (
  auth.uid() = user_id
  OR public.is_course_author(auth.uid(), public.get_course_id_for_discussion(discussion_id))
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Course resources: tighten access
DROP POLICY IF EXISTS "Public resources are viewable by everyone enrolled" ON public.course_resources;
DROP POLICY IF EXISTS "Instructors can manage resources" ON public.course_resources;

CREATE POLICY "Resources viewable by enrolled users"
ON public.course_resources FOR SELECT
USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Instructors can manage resources"
ON public.course_resources FOR ALL
USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Attendance: allow enrolled students to view sessions, and instructors/admins manage
DROP POLICY IF EXISTS "Instructors can manage sessions" ON public.attendance_sessions;
CREATE POLICY "Course sessions viewable by enrolled users"
ON public.attendance_sessions FOR SELECT
USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
CREATE POLICY "Instructors can manage sessions"
ON public.attendance_sessions FOR INSERT
WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Instructors can update sessions"
ON public.attendance_sessions FOR UPDATE
USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Instructors can delete sessions"
ON public.attendance_sessions FOR DELETE
USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Instructors can manage records" ON public.attendance_records;
DROP POLICY IF EXISTS "Students can view their own records" ON public.attendance_records;
CREATE POLICY "Students can view their own records"
ON public.attendance_records FOR SELECT
USING (auth.uid() = student_id);
CREATE POLICY "Instructors can manage records"
ON public.attendance_records FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.attendance_sessions s
    JOIN public.courses c ON c.id = s.course_id
    WHERE s.id = attendance_records.session_id
      AND (c.author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.attendance_sessions s
    JOIN public.courses c ON c.id = s.course_id
    WHERE s.id = attendance_records.session_id
      AND (c.author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

-- updated_at triggers for discussions/replies/resources/attendance
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'discussions' AND column_name = 'updated_at') THEN
    DROP TRIGGER IF EXISTS update_discussions_updated_at ON public.discussions;
    CREATE TRIGGER update_discussions_updated_at
    BEFORE UPDATE ON public.discussions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'discussion_replies' AND column_name = 'updated_at') THEN
    DROP TRIGGER IF EXISTS update_discussion_replies_updated_at ON public.discussion_replies;
    CREATE TRIGGER update_discussion_replies_updated_at
    BEFORE UPDATE ON public.discussion_replies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_resources' AND column_name = 'created_at') THEN
    ALTER TABLE public.course_resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    DROP TRIGGER IF EXISTS update_course_resources_updated_at ON public.course_resources;
    CREATE TRIGGER update_course_resources_updated_at
    BEFORE UPDATE ON public.course_resources
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'attendance_sessions' AND column_name = 'created_at') THEN
    ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    DROP TRIGGER IF EXISTS update_attendance_sessions_updated_at ON public.attendance_sessions;
    CREATE TRIGGER update_attendance_sessions_updated_at
    BEFORE UPDATE ON public.attendance_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'attendance_records' AND column_name = 'created_at') THEN
    ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON public.attendance_records;
    CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_discussions_course ON public.discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user ON public.discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion ON public.discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course ON public.course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_module ON public.course_resources(module_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_course ON public.attendance_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON public.attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
