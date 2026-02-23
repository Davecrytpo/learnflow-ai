-- Add module_id to assignments to allow organization within curriculum sections
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Create course resources table for files and links
CREATE TABLE IF NOT EXISTS public.course_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'link', -- 'link', 'file', 'video'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

-- Policies for resources
CREATE POLICY "Public resources are viewable by everyone enrolled" 
ON public.course_resources FOR SELECT USING (true);

CREATE POLICY "Instructors can manage resources" 
ON public.course_resources FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE id = course_resources.course_id AND author_id = auth.uid()
    )
);
