import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BrandingImage = { id: string; url: string; caption?: string };
export type BrandingStore = { carousel: BrandingImage[]; gallery: BrandingImage[] };

const empty: BrandingStore = { carousel: [], gallery: [] };

export const brandingUid = () => crypto.randomUUID();

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/** Upload a file to admin-media bucket and return its public URL. */
export async function uploadAdminMedia(file: File, folder = "branding"): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("admin-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("admin-media").getPublicUrl(path);
  return data.publicUrl;
}

async function fetchAll(): Promise<BrandingStore> {
  const { data, error } = await supabase
    .from("branding_media")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !data) return empty;
  const result: BrandingStore = { carousel: [], gallery: [] };
  for (const row of data) {
    const item: BrandingImage = { id: row.id, url: row.url, caption: row.caption ?? undefined };
    if (row.tab === "carousel") result.carousel.push(item);
    else if (row.tab === "gallery") result.gallery.push(item);
  }
  return result;
}

export function useBrandingMedia() {
  const [store, setStore] = useState<BrandingStore>(empty);
  const [hydrated, setHydrated] = useState(false);

  const reload = useCallback(async () => {
    const next = await fetchAll();
    setStore(next);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchAll().then((s) => {
      if (!mounted) return;
      setStore(s);
      setHydrated(true);
    });
    const channel = supabase
      .channel(`branding_media_changes_${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "branding_media" },
        () => {
          fetchAll().then((s) => mounted && setStore(s));
        }
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { store, hydrated, reload };
}

export async function addBrandingItem(tab: "carousel" | "gallery", url: string, caption?: string) {
  const { error } = await supabase
    .from("branding_media")
    .insert({ tab, url, caption: caption || null });
  if (error) throw error;
}

export async function removeBrandingItem(id: string) {
  const { error } = await supabase.from("branding_media").delete().eq("id", id);
  if (error) throw error;
}
