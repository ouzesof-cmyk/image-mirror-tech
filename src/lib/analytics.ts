import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "ouzesof_visitor_id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export async function trackVisit(path: string) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("page_visits").insert({
      path,
      visitor_id: getVisitorId(),
    });
  } catch (e) {
    // tracking is best-effort, never break the page
    console.warn("visit tracking failed", e);
  }
}
