-- Backend extensions for enterprise LMS capabilities

-- Course announcements
CREATE TABLE IF NOT EXISTS public.course_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements viewable by enrolled users"
ON public.course_announcements FOR SELECT
USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Instructors manage announcements"
ON public.course_announcements FOR ALL
USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_course_announcements_updated_at ON public.course_announcements;
CREATE TRIGGER update_course_announcements_updated_at
BEFORE UPDATE ON public.course_announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Cohorts / groups
CREATE TABLE IF NOT EXISTS public.course_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.course_groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, student_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups viewable by enrolled users"
ON public.course_groups FOR SELECT
USING (
  public.is_course_author(auth.uid(), course_id)
  OR public.is_enrolled(auth.uid(), course_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Instructors manage groups"
ON public.course_groups FOR ALL
USING (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_course_author(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Group membership viewable by enrolled users"
ON public.group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.course_groups g
    WHERE g.id = group_members.group_id
      AND (
        public.is_course_author(auth.uid(), g.course_id)
        OR public.is_enrolled(auth.uid(), g.course_id)
        OR public.has_role(auth.uid(), 'admin'::app_role)
      )
  )
);

CREATE POLICY "Instructors manage group members"
ON public.group_members FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.course_groups g
    WHERE g.id = group_members.group_id
      AND (public.is_course_author(auth.uid(), g.course_id) OR public.has_role(auth.uid(), 'admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.course_groups g
    WHERE g.id = group_members.group_id
      AND (public.is_course_author(auth.uid(), g.course_id) OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() = actor_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_announcements_course ON public.course_announcements(course_id);
CREATE INDEX IF NOT EXISTS idx_course_announcements_author ON public.course_announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_course_groups_course ON public.course_groups(course_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_student ON public.group_members(student_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
