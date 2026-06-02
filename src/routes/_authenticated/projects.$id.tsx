import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  component: ProjectDetail,
});

type Project = {
  id: string; title: string; description: string; category: string | null;
  current_stage: string; progress: number; stages: string[]; client_id: string;
};
type Message = { id: string; sender_id: string; sender_role: string; body: string; created_at: string; read: boolean };

function ProjectDetail() {
  const { id } = useParams({ from: "/_authenticated/projects/$id" });
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("client_projects").select("*").eq("id", id).maybeSingle().then(({ data }) => setProject(data as Project | null));
    supabase.from("project_messages").select("*").eq("project_id", id).order("created_at").then(({ data }) => setMessages((data ?? []) as Message[]));

    const ch = supabase.channel(`pm-${id}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${id}` },
      (payload) => setMessages((prev) => [...prev, payload.new as Message]),
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || !project) return;
    const body = text.trim();
    setText("");
    const { error } = await supabase.from("project_messages").insert({
      project_id: id, client_id: project.client_id, sender_id: user.id, sender_role: "client", body,
    });
    if (error) toast.error(error.message);
  };

  if (!project) return <div className="panel-convex rounded-3xl p-12 text-center text-muted-foreground">Loading project…</div>;

  return (
    <div className="space-y-6">
      <header className="panel-convex rounded-3xl p-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{project.category || "Project"}</p>
        <h1 className="font-display text-2xl font-black mt-1">{project.title}</h1>
        {project.description && <p className="text-sm text-muted-foreground mt-2">{project.description}</p>}
      </header>

      {/* Timeline */}
      <section className="panel-convex rounded-3xl p-6">
        <h2 className="font-bold mb-5">Project Stages</h2>
        <div className="relative">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-foreground/10" />
          <div className="absolute top-4 left-4 h-0.5 bg-[var(--electric)] transition-all" style={{ width: `calc(${project.progress}% - 1rem)` }} />
          <div className="relative flex justify-between">
            {project.stages.map((s) => {
              const idx = project.stages.indexOf(project.current_stage);
              const cur = project.stages.indexOf(s);
              const done = cur < idx;
              const active = cur === idx;
              return (
                <div key={s} className="flex flex-col items-center gap-2 flex-1">
                  {done ? <CheckCircle2 className="h-8 w-8 text-[var(--electric)] bg-background rounded-full" />
                    : active ? <div className="h-8 w-8 rounded-full bg-[var(--electric)] flex items-center justify-center text-primary-foreground font-bold text-xs animate-pulse">●</div>
                    : <Circle className="h-8 w-8 text-muted-foreground bg-background rounded-full" />}
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${active ? "text-[var(--electric)]" : "text-muted-foreground"}`}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 h-3 bg-foreground/10 rounded-full overflow-hidden">
          <div className="h-full bg-[var(--electric)] [box-shadow:0_0_10px_var(--electric)]" style={{ width: `${project.progress}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{project.progress}% complete</p>
      </section>

      {/* Messages */}
      <section className="panel-convex rounded-3xl p-6 flex flex-col h-[500px]">
        <h2 className="font-bold mb-4">Project Chat</h2>
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Say hi 👋</p>}
          {messages.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${mine ? "bg-primary text-primary-foreground" : "panel-concave"}`}>
                  <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">{m.sender_role}</p>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={send} className="mt-4 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 panel-concave rounded-xl px-4 py-3 bg-transparent outline-none text-sm" />
          <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-5 font-bold"><Send className="h-4 w-4" /></button>
        </form>
      </section>
    </div>
  );
}