import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Thread = { project_id: string; client_id: string; title: string; client_name: string | null; last: string; last_at: string };
type Message = { id: string; project_id: string; client_id: string; sender_id: string; sender_role: string; body: string; created_at: string };

export function AdminMessages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadThreads = async () => {
    const { data } = await supabase.from("client_projects").select("id,client_id,title,profiles:profiles!inner(full_name)").order("updated_at", { ascending: false });
    if (!data) return;
    const ids = data.map((d) => d.id);
    const { data: lastMsgs } = await supabase.from("project_messages").select("project_id,body,created_at").in("project_id", ids).order("created_at", { ascending: false });
    const byProject = new Map<string, { body: string; at: string }>();
    (lastMsgs ?? []).forEach((m) => { if (!byProject.has(m.project_id!)) byProject.set(m.project_id!, { body: m.body, at: m.created_at }); });
    setThreads(data.map((d) => ({
      project_id: d.id, client_id: d.client_id, title: d.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client_name: (d.profiles as any)?.full_name ?? null,
      last: byProject.get(d.id)?.body ?? "(no messages)", last_at: byProject.get(d.id)?.at ?? "",
    })));
  };

  useEffect(() => { loadThreads(); }, []);

  useEffect(() => {
    if (!active) return;
    supabase.from("project_messages").select("*").eq("project_id", active.project_id).order("created_at")
      .then(({ data }) => setMsgs((data ?? []) as Message[]));
    const ch = supabase.channel("adm-pm-" + active.project_id).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${active.project_id}` },
      (p) => setMsgs((prev) => [...prev, p.new as Message]),
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !active || !user) return;
    const body = text.trim(); setText("");
    const { error } = await supabase.from("project_messages").insert({
      project_id: active.project_id, client_id: active.client_id, sender_id: user.id, sender_role: "admin", body,
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <div className="panel-convex rounded-3xl p-4 overflow-y-auto">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-[var(--electric)]" /> Threads</h3>
        {threads.length === 0 ? <p className="text-xs text-muted-foreground">No client projects yet.</p> : (
          <div className="space-y-1">
            {threads.map((t) => (
              <button key={t.project_id} onClick={() => setActive(t)} className={`w-full text-left panel-concave rounded-xl p-3 ${active?.project_id === t.project_id ? "border-2 border-[var(--electric)]/50" : ""}`}>
                <p className="font-bold text-xs">{t.client_name || "Client"}</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--electric)] truncate">{t.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">{t.last}</p>
                {t.last_at && <p className="text-[9px] text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(t.last_at), { addSuffix: true })}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="md:col-span-2 panel-convex rounded-3xl p-4 flex flex-col">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a thread to start chatting.</div>
        ) : (
          <>
            <header className="pb-3 border-b border-border/40">
              <p className="font-bold text-sm">{active.client_name || "Client"}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--electric)]">{active.title}</p>
            </header>
            <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-2">
              {msgs.map((m) => {
                const mine = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "panel-concave"}`}>
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={send} className="flex gap-2 pt-3 border-t border-border/40">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply as admin..." className="flex-1 panel-concave rounded-xl px-4 py-2.5 bg-transparent outline-none text-sm" />
              <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-4"><Send className="h-4 w-4" /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}