-- Seed file for Global University Institute
-- Run this in your Supabase SQL Editor to populate the database with example data.

-- 1. Create a placeholder instructor (You should replace this with a real user ID after signup)
-- For now, we will use a subquery to find an existing user or just skip if no users exist.

DO $$
DECLARE
    instructor_id UUID;
BEGIN
    -- Try to find the first user in the system
    SELECT id INTO instructor_id FROM auth.users LIMIT 1;

    IF instructor_id IS NOT NULL THEN
        -- Ensure the user has the instructor role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (instructor_id, 'instructor')
        ON CONFLICT DO NOTHING;

        -- Insert Courses
        INSERT INTO public.courses (author_id, slug, title, summary, description, category, published, price_cents)
        VALUES 
        (instructor_id, 'quantum-computing-101', 'Quantum Computing Fundamentals', 'An introduction to quantum bits, gates, and algorithms.', '<p>This course provides a comprehensive introduction to the field of quantum computing. Students will learn about qubits, superposition, entanglement, and quantum gates.</p><ul><li>Qubits and Superposition</li><li>Quantum Logic Gates</li><li>Shor''s Algorithm</li><li>Grover''s Algorithm</li></ul>', 'Technology', true, 49900),
        
        (instructor_id, 'advanced-macroeconomics', 'Advanced Macroeconomic Theory', 'Master the complex dynamics of global fiscal and monetary policy.', '<p>Deep dive into modern macroeconomic models, including DSGE and neoclassical growth theory. Essential for aspiring economists.</p>', 'Business', true, 59900),
        
        (instructor_id, 'biotechnology-ethics', 'Ethics in Biotechnology', 'Exploring the moral implications of genetic engineering and synthetic biology.', '<p>A critical examination of the ethical, legal, and social implications of modern biotechnology.</p>', 'Science', true, 0),
        
        (instructor_id, 'digital-transformation-leadership', 'Digital Transformation Leadership', 'Strategies for leading organizations through the digital age.', '<p>Learn how to navigate organizational change and leverage emerging technologies for competitive advantage.</p>', 'Business', true, 75000),
        
        (instructor_id, 'ai-for-educational-design', 'AI for Educational Design', 'Leveraging large language models to create better learning experiences.', '<p>Explore how AI can personalize learning, automate grading, and assist in curriculum design.</p>', 'Technology', true, 29900);

        -- Insert Modules for the first course
        INSERT INTO public.modules (course_id, title, "order")
        SELECT id, 'Introduction to Quantum Mechanics', 1 FROM public.courses WHERE slug = 'quantum-computing-101';
        
        INSERT INTO public.modules (course_id, title, "order")
        SELECT id, 'Quantum Gates and Circuits', 2 FROM public.courses WHERE slug = 'quantum-computing-101';

        -- Insert Lessons
        INSERT INTO public.lessons (module_id, course_id, title, content, "order", published)
        SELECT m.id, c.id, 'The Qubit Explained', '<p>A qubit is the basic unit of quantum information.</p>', 1, true
        FROM public.modules m JOIN public.courses c ON m.course_id = c.id
        WHERE c.slug = 'quantum-computing-101' AND m.title = 'Introduction to Quantum Mechanics';

    END IF;
END $$;
