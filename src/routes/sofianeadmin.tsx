import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createAdminAccount } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/sofianeadmin")({
  head: () => ({
    meta: [
      { title: "Admin bootstrap" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SofianeAdminPage,
});

function SofianeAdminPage() {
  const navigate = useNavigate();
  const create = useServerFn(createAdminAccount);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await create({ data: { email, password } });
      // Sign the new admin in immediately.
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Admin account ready.");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md frosted rounded-3xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--electric)]/15 text-[var(--electric)] mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
            Admin Bootstrap
          </p>
          <h1 className="mt-2 font-display text-3xl font-black">Create admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter an email and password. The account is created with admin
            privileges and email pre-confirmed.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+ chars)"
            className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create admin & sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
