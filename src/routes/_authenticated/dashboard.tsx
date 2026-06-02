import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FolderKanban, MessageSquare, CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Project = { id: string; title: string; current_stage: string; progress: number };
type Booking = { id: string; topic: string; scheduled_at: string; status: string };

function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, b, m] = await Promise.all([
        supabase.from("client_projects").select("id,title,current_stage,progress").eq("client_id", user.id).order("created_at", { ascending: false }),
        supabase.from("zoom_bookings").select("id,topic,scheduled_at,status").eq("client_id", user.id).gte("scheduled_at", new Date().toISOString()).order("scheduled_at"),
        supabase.from("project_messages").select("id", { count: "exact", head: true }).eq("client_id", user.id).eq("read", false).neq("sender_id", user.id),
      ]);
      if (p.data) setProjects(p.data as Project[]);
      if (b.data) setBookings(b.data as Booking[]);
      setUnread(m.count ?? 0);
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">Overview</p>
        <h1 className="font-display text-3xl font-black mt-1">Welcome, {user?.user_metadata.full_name || user?.email}</h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile Icon={FolderKanban} label="Active Projects" value={projects.length} to="/projects" />
        <StatTile Icon={MessageSquare} label="Unread Messages" value={unread} to="/messages" />
        <StatTile Icon={CalendarDays} label="Upcoming Calls" value={bookings.length} to="/book" />
      </section>
      <section className="panel-convex rounded-3xl p-6">
        <h2 className="font-bold text-lg mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet. Once we kick off, your progress will appear here.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Link key={p.id} to="/projects/$id" params={{ id: p.id }}
                className="block panel-concave rounded-2xl p-4 hover:border-[var(--electric)]/40 transition">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{p.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--electric)] font-bold">{p.current_stage}</span>
                </div>
                <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--electric)]" style={{ width: `${p.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ Icon, label, value, to }: { Icon: typeof FolderKanban; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="panel-convex rounded-3xl p-5 flex items-start justify-between hover:border-[var(--electric)]/40 transition group">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
      <div className="p-2 bg-[var(--electric)]/15 rounded-lg group-hover:scale-110 transition">
        <Icon className="h-5 w-5 text-[var(--electric)]" />
      </div>
      <ArrowRight className="h-4 w-4 absolute opacity-0" />
    </Link>
  );
}