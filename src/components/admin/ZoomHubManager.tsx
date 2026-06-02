import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

type Settings = { zoom_link: string; meeting_id: string; passcode: string; instructions: string };
type Booking = { id: string; client_name: string | null; client_email: string | null; topic: string; scheduled_at: string; status: string; notes: string | null };

export function ZoomHubManager() {
  const [s, setS] = useState<Settings>({ zoom_link: "", meeting_id: "", passcode: "", instructions: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("zoom_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setS({
        zoom_link: data.zoom_link ?? "", meeting_id: data.meeting_id ?? "",
        passcode: data.passcode ?? "", instructions: data.instructions ?? "",
      });
    });
    refresh();
  }, []);

  const refresh = () => {
    supabase.from("zoom_bookings").select("*").order("scheduled_at", { ascending: false })
      .then(({ data }) => setBookings((data ?? []) as Booking[]));
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("zoom_settings").update({
      zoom_link: s.zoom_link, meeting_id: s.meeting_id, passcode: s.passcode, instructions: s.instructions,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Zoom settings saved.");
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("zoom_bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
    toast.success(status);
  };

  return (
    <div className="space-y-6">
      <section className="panel-convex rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><CalendarDays className="h-5 w-5 text-[var(--electric)]" /> Zoom Settings</h2>
        <p className="text-xs text-muted-foreground">Paste your personal Zoom meeting link here. All clients see this when booking.</p>
        <input value={s.zoom_link} onChange={(e) => setS({ ...s, zoom_link: e.target.value })} placeholder="https://zoom.us/j/..." className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <input value={s.meeting_id} onChange={(e) => setS({ ...s, meeting_id: e.target.value })} placeholder="Meeting ID" className="panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
          <input value={s.passcode} onChange={(e) => setS({ ...s, passcode: e.target.value })} placeholder="Passcode" className="panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
        </div>
        <textarea value={s.instructions} onChange={(e) => setS({ ...s, instructions: e.target.value })} placeholder="Instructions for clients (optional)" rows={3} className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none resize-none" />
        <button onClick={save} disabled={saving} className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 font-bold text-sm disabled:opacity-50">
          {saving ? "Saving..." : "Save Zoom settings"}
        </button>
      </section>

      <section className="panel-convex rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4">Booking Requests ({bookings.length})</h2>
        {bookings.length === 0 ? <p className="text-sm text-muted-foreground">No bookings yet.</p> : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="panel-concave rounded-2xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{b.topic}</p>
                    <p className="text-xs text-muted-foreground">{b.client_name || b.client_email} · {new Date(b.scheduled_at).toLocaleString()}</p>
                    {b.notes && <p className="text-xs mt-1">{b.notes}</p>}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${b.status === "confirmed" ? "bg-[var(--electric)]/15 text-[var(--electric)]" : b.status === "cancelled" ? "bg-destructive/15 text-destructive" : "bg-foreground/10"}`}>{b.status}</span>
                    <div className="flex gap-1">
                      <button onClick={() => setStatus(b.id, "confirmed")} className="p-1.5 hover:text-[var(--electric)]"><CheckCircle2 className="h-4 w-4" /></button>
                      <button onClick={() => setStatus(b.id, "cancelled")} className="p-1.5 hover:text-destructive"><XCircle className="h-4 w-4" /></button>
                      <a href={`mailto:${b.client_email}?subject=Re: ${encodeURIComponent(b.topic)}`} className="p-1.5 hover:text-[var(--electric)]"><ExternalLink className="h-4 w-4" /></a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}