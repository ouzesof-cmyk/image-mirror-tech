import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createDailyRoom } from "@/lib/daily.functions";
import { toast } from "sonner";
import { Video, Copy, PhoneCall } from "lucide-react";
import { DailyCall } from "@/components/client/DailyCall";

type Profile = { user_id: string; full_name: string | null; email: string | null };
type Session = { id: string; client_id: string; room_url: string; status: string; created_at: string; expires_at: string | null };

export function AdminCalls() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [active, setActive] = useState<Session | null>(null);
  const [creating, setCreating] = useState(false);
  const create = useServerFn(createDailyRoom);

  const refresh = async () => {
    const [c, s] = await Promise.all([
      supabase.from("profiles").select("user_id,full_name,email"),
      supabase.from("call_sessions").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setClients((c.data ?? []) as Profile[]);
    setSessions((s.data ?? []) as Session[]);
  };
  useEffect(() => { refresh(); }, []);

  const start = async () => {
    if (!selected) return toast.error("Pick a client first.");
    setCreating(true);
    try {
      await create({ data: { clientId: selected, expiryMinutes: 60 } });
      toast.success("Call room created — the client will see it in their portal.");
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setCreating(false); }
  };

  const endSession = async (id: string) => {
    await supabase.from("call_sessions").update({ status: "ended" }).eq("id", id);
    refresh();
  };

  if (active) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Live Call</h2>
          <button onClick={() => setActive(null)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        <DailyCall url={active.room_url} onLeave={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel-convex rounded-3xl p-6 space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2"><PhoneCall className="h-5 w-5 text-[var(--electric)]" /> Start a Call</h2>
        <p className="text-xs text-muted-foreground">Creates a Daily.co room visible to the chosen client inside their portal.</p>
        <div className="flex gap-2">
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className="flex-1 panel-concave rounded-xl px-4 py-2.5 text-sm bg-transparent outline-none">
            <option value="">Select a client...</option>
            {clients.map((c) => <option key={c.user_id} value={c.user_id}>{c.full_name || c.email}</option>)}
          </select>
          <button onClick={start} disabled={creating} className="bg-primary text-primary-foreground rounded-xl px-5 font-bold text-sm disabled:opacity-50">
            {creating ? "Creating..." : "Create Room"}
          </button>
        </div>
      </section>

      <section className="panel-convex rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4">Recent Sessions</h2>
        {sessions.length === 0 ? <p className="text-sm text-muted-foreground">No call sessions yet.</p> : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const c = clients.find((x) => x.user_id === s.client_id);
              return (
                <div key={s.id} className="panel-concave rounded-2xl p-4 flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm">{c?.full_name || c?.email || "Client"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{s.room_url}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${s.status === "active" ? "bg-[var(--electric)]/15 text-[var(--electric)]" : "bg-foreground/10 text-muted-foreground"}`}>{s.status}</span>
                  {s.status === "active" && (
                    <>
                      <button onClick={() => setActive(s)} className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1"><Video className="h-3 w-3" /> Join</button>
                      <button onClick={() => { navigator.clipboard.writeText(s.room_url); toast.success("Copied."); }} className="p-2 text-muted-foreground hover:text-[var(--electric)]"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => endSession(s.id)} className="text-xs text-destructive hover:underline">End</button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}