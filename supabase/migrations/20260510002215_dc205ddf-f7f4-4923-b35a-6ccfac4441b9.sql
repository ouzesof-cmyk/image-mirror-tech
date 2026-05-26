
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Replace broad listing policy
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
