import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MediaKind = "image" | "video" | "link";

export type PortfolioMedia = {
  id: string;
  kind: MediaKind;
  url: string;
  caption?: string;
};

export type PortfolioItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  cover?: string;
  media: PortfolioMedia[];
  createdAt: number;
};

export type CategoryKey =
  | "web"
  | "3d"
  | "photography"
  | "videography"
  | "marketing"
  | "branding";

export type PortfolioStore = Record<CategoryKey, PortfolioItem[]>;

export const emptyPortfolioStore: PortfolioStore = {
  web: [], "3d": [], photography: [], videography: [], marketing: [], branding: [],
};

function rowToItem(row: {
  id: string; category: string; title: string; description: string;
  cover: string | null; media: unknown; created_at: string;
}): PortfolioItem {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    cover: row.cover ?? undefined,
    media: Array.isArray(row.media) ? (row.media as PortfolioMedia[]) : [],
    createdAt: new Date(row.created_at).getTime(),
  };
}

async function fetchAll(): Promise<PortfolioStore> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return emptyPortfolioStore;
  const store: PortfolioStore = { ...emptyPortfolioStore, web: [], "3d": [], photography: [], videography: [], marketing: [], branding: [] };
  for (const row of data) {
    const it = rowToItem(row as never);
    const cat = it.category as CategoryKey;
    if (store[cat]) store[cat].unshift(it);
  }
  // re-sort newest first per category
  (Object.keys(store) as CategoryKey[]).forEach((k) => {
    store[k].sort((a, b) => b.createdAt - a.createdAt);
  });
  return store;
}

export function usePortfolio() {
  const [store, setStore] = useState<PortfolioStore>(emptyPortfolioStore);
  const [hydrated, setHydrated] = useState(false);

  const reload = useCallback(async () => {
    setStore(await fetchAll());
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchAll().then((s) => {
      if (!mounted) return;
      setStore(s);
      setHydrated(true);
    });
    const channel = supabase
      .channel(`portfolio_items_changes_${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio_items" },
        () => fetchAll().then((s) => mounted && setStore(s))
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { store, hydrated, reload };
}

export async function createPortfolioItem(category: CategoryKey): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({ category, title: "Untitled Project", description: "", media: [] })
    .select()
    .single();
  if (error || !data) throw error ?? new Error("create failed");
  return rowToItem(data as never);
}

export async function updatePortfolioItem(item: PortfolioItem): Promise<void> {
  const { error } = await supabase
    .from("portfolio_items")
    .update({
      title: item.title,
      description: item.description,
      cover: item.cover ?? null,
      media: item.media,
    })
    .eq("id", item.id);
  if (error) throw error;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) throw error;
}
