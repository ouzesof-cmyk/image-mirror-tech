import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CalendarDays, Clock, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/book")({
  component: BookPage,
});

type Settings = { zoom_link: string | null; meeting_id: string | null; passcode: string | null; instructions: string | null };
type Booking = { id: string; topic: string; scheduled_at: string; status: string; duration_min: number };

function BookPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [mine, setMine] = useState<Booking[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    if (!user) return;
    const { data } = await supabase.from("zoom_bookings").select("id,topic,scheduled_at,status,duration_min")
      .eq("client_id", user.id).order("scheduled_at", { ascending: false });
    setMine((data ?? []) as Booking[]);
  };

  useEffect(() => {
    supabase.from("zoom_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setSettings(data as Settings | null));
    refresh();
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    const { error } = await supabase.from("zoom_bookings").insert({
      client_id: user.id,
      client_name: user.user_metadata.full_name || null,
      client_email: user.email,
      topic, scheduled_at: scheduledAt, notes,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Booking requested. You'll get a confirmation.");
    setTopic(""); setDate(""); setTime(""); setNotes("");
    refresh();
  };

  const copyLink = () => {
    if (!settings?.zoom_link) return;
    navigator.clipboard.writeText(settings.zoom_link);
    toast.success("Zoom link copied.");
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">Zoom Scheduling Hub</p>
        <h1 className="font-display text-3xl font-black mt-1">Book a Zoom call</h1>
      </header>

      {settings?.zoom_link && (
        <section className="panel-convex rounded-3xl p-6 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Permanent Meeting Room</p>
          <div className="flex items-center gap-2 panel-concave rounded-xl p-3">
            <code className="text-xs flex-1 truncate">{settings.zoom_link}</code>
            <button onClick={copyLink} className="text-[var(--electric)] hover:scale-110 transition"><Copy className="h-4 w-4" /></button>
            <a href={settings.zoom_link} target="_blank" rel="noopener" className="text-[var(--electric)] hover:scale-110 transition"><ExternalLink className="h-4 w-4" /></a>
          </div>
          {(settings.meeting_id || settings.passcode) && (
            <p className="text-xs text-muted-foreground">
              {settings.meeting_id && <>ID: <span className="font-mono text-foreground">{settings.meeting_id}</span> · </>}
              {settings.passcode && <>Passcode: <span className="font-mono text-foreground">{settings.passcode}</span></>}
            </p>
          )}
          {settings.instructions && <p className="text-xs text-muted-foreground whitespace-pre-wrap">{settings.instructions}</p>}
        </section>
      )}

      <form onSubmit={submit} className="panel-convex rounded-3xl p-6 space-y-4">
        <h2 className="font-bold">Request a time</h2>
        <input required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Branding kickoff)" className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
          <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none" />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={3} className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none resize-none" />
        <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold disabled:opacity-50">
          {submitting ? "Sending..." : "Request booking"}
        </button>
      </form>

      <section className="panel-convex rounded-3xl p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[var(--electric)]" /> Your bookings</h2>
        {mine.length === 0 ? <p className="text-sm text-muted-foreground">No bookings yet.</p> : (
          <div className="space-y-2">
            {mine.map((b) => (
              <div key={b.id} className="panel-concave rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{b.topic}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {new Date(b.scheduled_at).toLocaleString()} · {b.duration_min}m
                  </p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${b.status === "confirmed" ? "bg-[var(--electric)]/15 text-[var(--electric)]" : "bg-foreground/10 text-muted-foreground"}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}