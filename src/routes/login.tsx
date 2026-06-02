import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/providers/AppProviders";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — OUZESOF" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, dir } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mapAuthError = (msg: string): string => {
    const m = msg.toLowerCase();
    if (m.includes("invalid login") || m.includes("invalid credentials")) return t("auth.err.invalid");
    if (m.includes("email not confirmed")) return t("auth.err.unconfirmed");
    if (m.includes("user not found")) return t("auth.err.notFound");
    if (m.includes("too many")) return t("auth.err.tooMany");
    return msg;
  };

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(mapAuthError(error.message));
    toast.success(t("auth.success.signIn"));
    navigate({ to: "/dashboard", replace: true });
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (res.error) toast.error(t("auth.err.google"));
  };

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md frosted rounded-3xl p-8 space-y-6">
        <div className="text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">{t("auth.portal")}</p>
          <h1 className="mt-2 font-display text-3xl font-black">{t("auth.login.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.login.subtitle")}</p>
        </div>
        <button
          onClick={onGoogle}
          className="w-full panel-convex rounded-xl py-3 text-sm font-bold hover:text-[var(--electric)] transition flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          {t("auth.google")}
        </button>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex-1 h-px bg-border" />{t("auth.or")}<div className="flex-1 h-px bg-border" />
        </div>
        <form onSubmit={onEmail} className="space-y-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.email")}
            className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")} minLength={6}
            className="w-full panel-concave rounded-xl px-4 py-3 text-sm bg-transparent outline-none"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm disabled:opacity-50"
          >
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          {t("auth.noAccount")} <Link to="/signup" className="text-[var(--electric)] font-bold">{t("auth.createOne")}</Link>
        </p>
      </div>
    </div>
  );
}
