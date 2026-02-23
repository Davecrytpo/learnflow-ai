-- Create discussions table
CREATE TABLE IF NOT EXISTS public.discussions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS public.discussion_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Policies for discussions
CREATE POLICY "Public discussions are viewable by everyone" 
ON public.discussions FOR SELECT USING (true);

CREATE POLICY "Users can create discussions if authenticated" 
ON public.discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own discussions" 
ON public.discussions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" 
ON public.discussions FOR DELETE USING (auth.uid() = user_id);

-- Policies for replies
CREATE POLICY "Public replies are viewable by everyone" 
ON public.discussion_replies FOR SELECT USING (true);

CREATE POLICY "Users can create replies if authenticated" 
ON public.discussion_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own replies" 
ON public.discussion_replies FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" 
ON public.discussion_replies FOR DELETE USING (auth.uid() = user_id);
