-- Replace permissive public insert checks with concrete validation rules
DROP POLICY IF EXISTS "anyone insert visits" ON public.page_visits;
CREATE POLICY "anyone insert visits" ON public.page_visits
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 512
  AND (visitor_id IS NULL OR char_length(visitor_id) <= 128)
);

DROP POLICY IF EXISTS "anyone insert msg" ON public.contact_messages;
CREATE POLICY "anyone insert msg" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 160
  AND char_length(email) BETWEEN 3 AND 320
  AND position('@' in email) > 1
  AND char_length(service) <= 160
  AND char_length(brief) BETWEEN 1 AND 5000
  AND status = 'pending'
);

-- Avoid exposing bucket listing through the API. Public file URLs still work because the bucket is public.
DROP POLICY IF EXISTS "public read admin-media" ON storage.objects;

-- Internal SECURITY DEFINER functions are used by triggers/RLS and should not be directly callable from clients.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;