import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DailyCall } from "@/components/client/DailyCall";
import { Video as VideoIcon, RadioTower } from "lucide-react";

export const Route = createFileRoute("/_authenticated/call")({
  component: CallPage,
});

type Session = { id: string; room_url: string; status: string; expires_at: string | null; created_at: string };

function CallPage() {
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("call_sessions").select("*")
        .eq("client_id", user.id).eq("status", "active")
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      setSession(data as Session | null);
    };
    load();
    const ch = supabase.channel("calls-" + user.id).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "call_sessions", filter: `client_id=eq.${user.id}` },
      load,
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  if (joined && session) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-black">Live call</h1>
        <DailyCall url={session.room_url} onLeave={() => setJoined(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">Live Voice/Video</p>
        <h1 className="font-display text-3xl font-black mt-1">Call the team</h1>
      </header>
      {session ? (
        <div className="panel-convex rounded-3xl p-8 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-[var(--electric)]/15">
            <RadioTower className="h-8 w-8 text-[var(--electric)] animate-pulse" />
          </div>
          <h2 className="font-bold text-xl">Your call room is ready</h2>
          <p className="text-sm text-muted-foreground">A live room was prepared for you. Click below to join.</p>
          <button onClick={() => setJoined(true)} className="bg-primary text-primary-foreground rounded-xl px-8 py-3 font-bold inline-flex items-center gap-2">
            <VideoIcon className="h-4 w-4" /> Join Call
          </button>
        </div>
      ) : (
        <div className="panel-convex rounded-3xl p-12 text-center">
          <VideoIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-bold text-lg">No active call</h2>
          <p className="text-sm text-muted-foreground mt-2">Ask the team to start a call from the admin panel, or book a Zoom in the meantime.</p>
        </div>
      )}
    </div>
  );
}