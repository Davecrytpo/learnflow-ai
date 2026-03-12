-- Migration to add institutional metadata to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Undergraduate';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '12 Weeks';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add check for institutional status
DO $$ BEGIN
  ALTER TABLE public.courses ADD CONSTRAINT courses_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
