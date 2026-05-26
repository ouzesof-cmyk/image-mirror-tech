import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, string>;
type Ctx = {
  t: (key: string, fallback?: string) => string;
  content: ContentMap;
  refresh: () => Promise<void>;
};

const ContentContext = createContext<Ctx>({ t: (_k, f) => f ?? "", content: {}, refresh: async () => {} });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});

  const refresh = useCallback(async () => {
    const { data } = await (supabase as any).from("site_content").select("key,value");
    if (data) {
      const map: ContentMap = {};
      data.forEach((r: any) => (map[r.key] = r.value));
      setContent(map);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const t = useCallback(
    (key: string, fallback = "") => (content[key] !== undefined && content[key] !== "" ? content[key] : fallback),
    [content],
  );

  return <ContentContext.Provider value={{ t, content, refresh }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export type Project = {
  id: string;
  title: string;
  client: string | null;
  year: string | null;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  span: string | null;
  sort_order: number;
  published: boolean;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (supabase as any)
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }: { data: any }) => {
        if (data) setProjects(data as any);
        setLoaded(true);
      });
  }, []);
  return { projects, loaded };
}
