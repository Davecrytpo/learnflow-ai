
-- Update handle_new_user trigger to support extended metadata from onboarding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _role public.app_role;
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (
    user_id, 
    display_name,
    institution,
    grade_level,
    state,
    phone,
    bio
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'institution',
    NEW.raw_user_meta_data->>'grade_level',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'bio'
  );

  -- 2. Assign Role
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'::public.app_role);
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  -- 3. Populate Specialized Profiles
  IF _role = 'student' THEN
    INSERT INTO public.student_profiles (user_id, learning_goals, learning_preference, proficiency_level)
    VALUES (
      NEW.id, 
      ARRAY[COALESCE(NEW.raw_user_meta_data->>'learning_goal', 'General')],
      NEW.raw_user_meta_data->>'learning_style',
      NEW.raw_user_meta_data->>'proficiency_level'
    ) ON CONFLICT (user_id) DO NOTHING;
  ELSIF _role = 'instructor' THEN
    INSERT INTO public.instructor_profiles (user_id, linkedin_url, experience_years, teaching_formats)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'linkedin_url',
      (NEW.raw_user_meta_data->>'years_experience')::INTEGER,
      ARRAY[NEW.raw_user_meta_data->>'teaching_format']
    ) ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- 4. Handle subject areas
  IF NEW.raw_user_meta_data->'subject_areas' IS NOT NULL THEN
    UPDATE public.profiles 
    SET subject_areas = ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'subject_areas'))
    WHERE user_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
