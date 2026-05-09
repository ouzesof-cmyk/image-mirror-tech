
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view portfolio media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admins can upload portfolio media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio media"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));
