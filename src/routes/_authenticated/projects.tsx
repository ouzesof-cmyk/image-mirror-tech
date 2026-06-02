import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});

type Project = { id: string; title: string; category: string | null; current_stage: string; progress: number };

function ProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("client_projects").select("id,title,category,current_stage,progress").eq("client_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Project[]));
  }, [user]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">My Projects</p>
        <h1 className="font-display text-3xl font-black mt-1">All projects</h1>
      </header>
      {items.length === 0 ? (
        <div className="panel-convex rounded-3xl p-12 text-center text-muted-foreground">
          No projects yet. We'll create one once your engagement starts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="panel-convex rounded-3xl p-6 hover:border-[var(--electric)]/40 transition">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category || "Project"}</p>
              <h3 className="font-bold text-lg mt-1">{p.title}</h3>
              <p className="text-xs text-[var(--electric)] mt-2 uppercase tracking-widest font-bold">{p.current_stage}</p>
              <div className="h-2 bg-foreground/10 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[var(--electric)]" style={{ width: `${p.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{p.progress}% complete</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}