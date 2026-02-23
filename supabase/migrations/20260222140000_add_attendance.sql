-- Create attendance tables
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(session_id, student_id)
);

-- Enable RLS
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Instructors can manage sessions" 
ON public.attendance_sessions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE id = attendance_sessions.course_id AND author_id = auth.uid()
    )
);

-- Policies for records
CREATE POLICY "Instructors can manage records" 
ON public.attendance_records FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.attendance_sessions 
        JOIN public.courses ON courses.id = attendance_sessions.course_id
        WHERE attendance_sessions.id = attendance_records.session_id AND courses.author_id = auth.uid()
    )
);

CREATE POLICY "Students can view their own records" 
ON public.attendance_records FOR SELECT USING (auth.uid() = student_id);
