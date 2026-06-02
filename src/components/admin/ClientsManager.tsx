import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, PlusCircle, Trash2, MessageSquare, PhoneCall, Video, Send, Copy, ArrowLeft, FolderHeart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { createDailyRoom } from "@/lib/daily.functions";
import { DailyCall } from "@/components/client/DailyCall";
import { formatDistanceToNow } from "date-fns";

type Profile = { user_id: string; full_name: string | null; email: string | null };
type Project = { id: string; client_id: string; title: string; category: string | null; current_stage: string; progress: number };
type Message = { id: string; project_id: string | null; client_id: string; sender_id: string | null; sender_role: string; body: string; created_at: string };
type Session = { id: string; client_id: string; room_url: string; status: string; created_at: string; expires_at: string | null };

const STAGES = ["discovery", "design", "development", "review", "delivered"];

export function ClientsManager() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Profile | null>(null);

  const refresh = async () => {
    const [c, p] = await Promise.all([
      supabase.from("profiles").select("user_id,full_name,email").order("created_at", { ascending: false }),
      supabase.from("client_projects").select("client_id"),
    ]);
    setClients((c.data ?? []) as Profile[]);
    const counts: Record<string, number> = {};
    (p.data ?? []).forEach((r: { client_id: string }) => {
      counts[r.client_id] = (counts[r.client_id] ?? 0) + 1;
    });
    setProjectCounts(counts);
  };
  useEffect(() => { refresh(); }, []);

  if (selected) {
    return (
      <ClientProfile
        client={selected}
        onBack={() => { setSelected(null); refresh(); }}
      />
    );
  }

  return (
    <section className="panel-convex rounded-3xl p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-[var(--electric)]" /> Clients ({clients.length})
      </h2>
      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clients have signed up yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((c) => (
            <button
              key={c.user_id}
              onClick={() => setSelected(c)}
              className="text-left panel-concave rounded-2xl p-4 hover:border-[var(--electric)]/40 border border-border/40 transition"
            >
              <p className="font-bold text-sm truncate">{c.full_name || "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{c.email}</p>
              <p className="mt-2 text-[10px] uppercase font-bold text-[var(--electric)]">
                {projectCounts[c.user_id] ?? 0} project{(projectCounts[c.user_id] ?? 0) !== 1 ? "s" : ""}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Client profile (tabs: Projects / Messages / Calls) ---------- */

type Tab = "projects" | "messages" | "calls";

function ClientProfile({ client, onBack }: { client: Profile; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <div className="space-y-5">
      <div className="panel-convex rounded-3xl p-5 flex items-center gap-4 flex-wrap">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--electric)]">
          <ArrowLeft className="h-4 w-4" /> All clients
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-black truncate">{client.full_name || "Unnamed client"}</p>
          <p className="text-xs text-muted-foreground truncate">{client.email}</p>
        </div>
        <div className="flex gap-2">
          {([
            { k: "projects", label: "Projects", Icon: FolderHeart },
            { k: "messages", label: "Messages", Icon: MessageSquare },
            { k: "calls", label: "Calls", Icon: PhoneCall },
          ] as { k: Tab; label: string; Icon: typeof FolderHeart }[]).map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition flex items-center gap-2 ${
                tab === k ? "bg-primary text-primary-foreground shadow-lg" : "panel-concave text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "projects" && <ProjectsPanel clientId={client.user_id} />}
      {tab === "messages" && <MessagesPanel clientId={client.user_id} />}
      {tab === "calls" && <CallsPanel clientId={client.user_id} clientName={client.full_name || client.email || "Client"} />}
    </div>
  );
}

/* ---------- Projects panel ---------- */

function ProjectsPanel({ clientId }: { clientId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Branding");

  const load = async () => {
    const { data } = await supabase
      .from("client_projects").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
    setProjects((data ?? []) as Project[]);
  };
  useEffect(() => { load(); }, [clientId]);

  const create = async () => {
    if (!newTitle.trim()) return toast.error("Project title required.");
    const { error } = await supabase.from("client_projects").insert({
      client_id: clientId, title: newTitle.trim(), category: newCategory, current_stage: "discovery", progress: 10,
    });
    if (error) return toast.error(error.message);
    setNewTitle(""); toast.success("Project created."); load();
  };

  const setStage = async (p: Project, stage: string) => {
    const idx = STAGES.indexOf(stage);
    const progress = Math.round(((idx + 1) / STAGES.length) * 100);
    const { error } = await supabase.from("client_projects").update({ current_stage: stage, progress }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("client_projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <section className="panel-convex rounded-3xl p-6 space-y-4">
      <div className="panel-concave rounded-2xl p-4 space-y-3">
        <p className="text-[10px] uppercase font-bold text-muted-foreground">New project</p>
        <div className="flex flex-wrap gap-2">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Project title"
            className="flex-1 min-w-[160px] panel-convex rounded-lg px-3 py-2 text-xs bg-transparent outline-none" />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            className="panel-convex rounded-lg px-2 py-2 text-xs bg-transparent outline-none">
            {["Branding","Web","3D","Photography","Videography","Marketing"].map((x) => <option key={x}>{x}</option>)}
          </select>
          <button onClick={create} className="bg-primary text-primary-foreground rounded-lg px-3 text-xs font-bold flex items-center gap-1">
            <PlusCircle className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet for this client.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="panel-concave rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3 gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{p.title}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">{p.category} · {p.progress}%</p>
                </div>
                <button onClick={() => remove(p.id)} className="text-destructive p-1"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {STAGES.map((st) => (
                  <button key={st} onClick={() => setStage(p, st)}
                    className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                      p.current_stage === st ? "bg-[var(--electric)] text-primary-foreground" : "panel-convex text-muted-foreground"
                    }`}>
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Messages panel (per client) ---------- */

function MessagesPanel({ clientId }: { clientId: string }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("client_projects").select("*").eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as Project[];
        setProjects(list);
        if (list.length && !activeId) setActiveId(list[0].id);
      });
  }, [clientId]);

  useEffect(() => {
    if (!activeId) return;
    supabase.from("project_messages").select("*").eq("project_id", activeId).order("created_at")
      .then(({ data }) => setMsgs((data ?? []) as Message[]));
    const ch = supabase.channel("pm-" + activeId).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${activeId}` },
      (p) => setMsgs((prev) => [...prev, p.new as Message]),
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeId || !user) return;
    const body = text.trim(); setText("");
    const { error } = await supabase.from("project_messages").insert({
      project_id: activeId, client_id: clientId, sender_id: user.id, sender_role: "admin", body,
    });
    if (error) toast.error(error.message);
  };

  if (projects.length === 0) {
    return (
      <section className="panel-convex rounded-3xl p-6 text-sm text-muted-foreground">
        Create a project for this client first — messaging is per-project.
      </section>
    );
  }

  return (
    <section className="panel-convex rounded-3xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-[560px]">
      <div className="overflow-y-auto space-y-1 panel-concave rounded-2xl p-3">
        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Projects</p>
        {projects.map((p) => (
          <button key={p.id} onClick={() => setActiveId(p.id)}
            className={`w-full text-left rounded-xl p-2.5 text-xs ${activeId === p.id ? "bg-[var(--electric)]/15 text-[var(--electric)]" : "hover:bg-foreground/5"}`}>
            <p className="font-bold truncate">{p.title}</p>
            <p className="text-[10px] text-muted-foreground uppercase">{p.current_stage}</p>
          </button>
        ))}
      </div>
      <div className="md:col-span-2 panel-concave rounded-2xl p-4 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-1 space-y-2">
          {msgs.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No messages yet — start the conversation.</p>
          ) : msgs.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "panel-convex"}`}>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className="text-[9px] opacity-60 mt-0.5">{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={send} className="flex gap-2 pt-3 border-t border-border/40">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply as admin..."
            className="flex-1 panel-convex rounded-xl px-4 py-2.5 bg-transparent outline-none text-sm" />
          <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-4"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Calls panel (per client) ---------- */

function CallsPanel({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<Session | null>(null);
  const [creating, setCreating] = useState(false);
  const create = useServerFn(createDailyRoom);

  const load = async () => {
    const { data } = await supabase.from("call_sessions").select("*")
      .eq("client_id", clientId).order("created_at", { ascending: false }).limit(20);
    setSessions((data ?? []) as Session[]);
  };
  useEffect(() => { load(); }, [clientId]);

  const start = async () => {
    setCreating(true);
    try {
      await create({ data: { clientId, expiryMinutes: 60 } });
      toast.success(`Call room created for ${clientName}.`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setCreating(false); }
  };

  const end = async (id: string) => {
    await supabase.from("call_sessions").update({ status: "ended" }).eq("id", id);
    load();
  };

  if (active) {
    return (
      <section className="panel-convex rounded-3xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm">Live with {clientName}</h3>
          <button onClick={() => setActive(null)} className="text-xs text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        <DailyCall url={active.room_url} onLeave={() => setActive(null)} />
      </section>
    );
  }

  return (
    <section className="panel-convex rounded-3xl p-6 space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2"><PhoneCall className="h-4 w-4 text-[var(--electric)]" /> Video calls</h3>
          <p className="text-xs text-muted-foreground">The client sees the room in their portal as soon as you create it.</p>
        </div>
        <button onClick={start} disabled={creating}
          className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 font-bold text-xs disabled:opacity-50 inline-flex items-center gap-2">
          <Video className="h-3.5 w-3.5" /> {creating ? "Creating..." : "Start a call"}
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No call history yet.</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="panel-concave rounded-2xl p-4 flex justify-between items-center gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground truncate">{s.room_url}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${s.status === "active" ? "bg-[var(--electric)]/15 text-[var(--electric)]" : "bg-foreground/10 text-muted-foreground"}`}>{s.status}</span>
              {s.status === "active" && (
                <>
                  <button onClick={() => setActive(s)} className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                    <Video className="h-3 w-3" /> Join
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(s.room_url); toast.success("Copied."); }} className="p-2 text-muted-foreground hover:text-[var(--electric)]">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => end(s.id)} className="text-xs text-destructive hover:underline">End</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
