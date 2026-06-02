
-- Default admin: ouzesof@gmail.com
-- Update handle_new_user to auto-assign admin role to the default admin email.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _default_admin CONSTANT text := 'ouzesof@gmail.com';
  _role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO NOTHING;

  IF lower(NEW.email) = _default_admin THEN
    _role := 'admin';
  ELSE
    _role := 'client';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: if ouzesof@gmail.com already signed up, ensure admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'ouzesof@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
