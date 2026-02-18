-- Add unique constraint for lesson_progress upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lesson_progress_user_lesson_unique'
  ) THEN
    ALTER TABLE public.lesson_progress ADD CONSTRAINT lesson_progress_user_lesson_unique UNIQUE (user_id, lesson_id);
  END IF;
END $$;
