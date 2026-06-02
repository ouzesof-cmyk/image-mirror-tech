-- Seed default admin user with confirmed email so they can sign in immediately
DO $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ouzesof@gmail.com') THEN
    _uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', _uid, 'authenticated', 'authenticated',
      'ouzesof@gmail.com', crypt('1995/12/1', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"OUZESOF Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), _uid, jsonb_build_object('sub', _uid::text, 'email', 'ouzesof@gmail.com', 'email_verified', true), 'email', _uid::text, now(), now(), now());
  END IF;
END $$;

-- Ensure profile + admin role exist (in case trigger didn't fire)
INSERT INTO public.profiles (user_id, email, full_name)
SELECT id, email, 'OUZESOF Admin' FROM auth.users WHERE email = 'ouzesof@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'ouzesof@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;