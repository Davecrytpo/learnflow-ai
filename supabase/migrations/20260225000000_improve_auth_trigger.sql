
-- Improve handle_new_user trigger to handle roles and additional profile fields from metadata
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
    phone
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'institution',
    NEW.raw_user_meta_data->>'grade_level',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'phone'
  );

  -- 2. Assign Role
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'::public.app_role);
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  -- 3. Handle subject areas if provided
  IF NEW.raw_user_meta_data->'subject_areas' IS NOT NULL THEN
    UPDATE public.profiles 
    SET subject_areas = ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'subject_areas'))
    WHERE user_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
