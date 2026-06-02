import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
});

type Row = { id: string; project_id: string | null; body: string; sender_role: string; created_at: string; read: boolean };

function MessagesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("project_messages").select("id,project_id,body,sender_role,created_at,read")
      .eq("client_id", user.id).order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setRows((data ?? []) as Row[]));
  }, [user]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">Messages</p>
        <h1 className="font-display text-3xl font-black mt-1">Conversation</h1>
        <p className="text-sm text-muted-foreground mt-2">Open any project to chat live with the team.</p>
      </header>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <div className="panel-convex rounded-3xl p-12 text-center text-muted-foreground">No messages yet.</div>
        ) : rows.map((m) => (
          <Link key={m.id} to="/projects/$id" params={{ id: m.project_id ?? "" }}
            className="block panel-convex rounded-2xl p-4 hover:border-[var(--electric)]/40 transition">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-[var(--electric)]">{m.sender_role}</span>
              <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</span>
            </div>
            <p className="text-sm line-clamp-2">{m.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}