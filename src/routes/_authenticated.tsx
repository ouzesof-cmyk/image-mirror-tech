import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FolderKanban, MessageSquare, CalendarDays, Video, LogOut, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_authenticated")({
  head: () => ({ meta: [{ title: "Client Portal — OUZESOF" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>;
  }
  if (!user) return null;

  const links = [
    { to: "/dashboard", label: "Overview", Icon: LayoutDashboard },
    { to: "/projects", label: "Projects", Icon: FolderKanban },
    { to: "/messages", label: "Messages", Icon: MessageSquare },
    { to: "/book", label: "Book Zoom", Icon: CalendarDays },
    { to: "/call", label: "Live Call", Icon: Video },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-28 lg:pb-12 px-3 sm:px-8">
      {/* Mobile top app bar (replaces public navbar context inside portal) */}
      <div className="lg:hidden fixed top-16 inset-x-3 z-40 frosted rounded-2xl px-4 py-3 flex items-center justify-between pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3 min-w-0">
          <Logo variant="mark" className="h-6 w-auto shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--electric)] leading-none">Portal</p>
            <p className="text-xs font-bold truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => { signOut(); navigate({ to: "/", replace: true }); }}
          className="h-9 w-9 rounded-full panel-concave flex items-center justify-center"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-auto max-w-[1400px] flex gap-6 mt-12 lg:mt-0">
        <aside className="hidden lg:flex w-60 shrink-0 flex-col panel-convex rounded-3xl p-5 sticky top-24 h-[calc(100vh-7rem)]">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)] mb-2 px-2">Portal</p>
          <p className="font-display font-black text-base px-2 mb-6 truncate">{user.email}</p>
          <nav className="flex-1 space-y-1">
            {links.map(({ to, label, Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <Link key={to} to={to}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition ${
                    active ? "bg-[var(--electric)]/15 text-[var(--electric)] panel-concave" : "text-muted-foreground hover:bg-foreground/5"
                  }`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => { signOut(); navigate({ to: "/", replace: true }); }}
            className="mt-6 flex items-center gap-2 py-2 px-3 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>

      {/* Mobile bottom tab bar — app-like persistent nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto max-w-md frosted rounded-2xl px-2 py-2 grid grid-cols-5 gap-1 glow-aura">
          {links.map(({ to, label, Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-semibold transition ${
                  active
                    ? "bg-[var(--electric)]/15 text-[var(--electric)]"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate max-w-full px-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}