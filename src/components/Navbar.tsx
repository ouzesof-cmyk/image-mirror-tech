import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, LogIn, LayoutDashboard, Menu, X, Home, Briefcase, Info, Mail } from "lucide-react";
import { useAudio, useT, useTheme } from "@/providers/AppProviders";
import { LANGS } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function Navbar() {
  const { t, lang, setLang } = useT();
  const { theme, toggle: toggleTheme } = useTheme();
  const { muted, toggle: toggleAudio, click } = useAudio();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home"), Icon: Home },
    { to: "/about", label: t("nav.about"), Icon: Info },
    { to: "/contact", label: t("nav.contact"), Icon: Mail },
  ];

  return (
    <>
    <header className="fixed top-0 inset-x-0 z-50 h-16 sm:h-20 px-3 sm:px-8 flex items-center pt-[env(safe-area-inset-top)]">
      <div className="mx-auto w-full max-w-7xl frosted rounded-2xl sm:rounded-full px-3 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between glow-aura">
        <Link
          to="/"
          onClick={click}
          className="flex items-center group"
          aria-label="OUZESOF"
        >
          <Logo variant="full" className="h-7 sm:h-8 w-auto group-hover:scale-[1.03] transition" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={click}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio wave toggle */}
          <button
            onClick={toggleAudio}
            aria-label={t("audio.mute")}
            className="hidden sm:flex h-10 w-10 rounded-full panel-convex items-center justify-center gap-[2px]"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block w-[2px] rounded-full bg-current"
                style={{
                  height: muted ? "6px" : `${6 + ((i * 5) % 12)}px`,
                  animation: muted
                    ? undefined
                    : `wave 1.2s ease-in-out ${i * 0.12}s infinite`,
                  color: muted ? "var(--muted-foreground)" : "var(--electric)",
                }}
              />
            ))}
          </button>

          {/* Language pill */}
          <div className="hidden sm:flex panel-concave rounded-full p-1 text-xs font-bold">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); click(); }}
                className={`px-3 py-1.5 rounded-full transition ${
                  lang === l.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme */}
          <button
            onClick={() => { toggleTheme(); click(); }}
            aria-label={t("theme.label")}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full panel-convex flex items-center justify-center"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Auth */}
          {user ? (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              onClick={click}
              className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_10px_30px_-10px_var(--primary)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              {isAdmin ? "Admin" : "Portal"}
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={click}
              className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full panel-convex text-xs font-bold hover:text-[var(--electric)] transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => { setOpen(true); click(); }}
            aria-label="Open menu"
            className="md:hidden h-9 w-9 rounded-full panel-convex flex items-center justify-center"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile full-screen drawer */}
    {open && (
      <div className="fixed inset-0 z-[60] md:hidden">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setOpen(false)}
        />
        <div className="absolute inset-x-3 top-3 bottom-3 panel-convex rounded-3xl p-5 flex flex-col animate-slide-up pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between">
            <Logo variant="full" className="h-7 w-auto" />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="h-9 w-9 rounded-full panel-concave flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5">
            {links.map(({ to, label, Icon }) => {
              const active = path === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => { setOpen(false); click(); }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)]"
                      : "panel-concave text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" /> {label}
                </Link>
              );
            })}
            <Link
              to="/portfolio/branding"
              onClick={() => { setOpen(false); click(); }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold panel-concave"
            >
              <Briefcase className="h-5 w-5" /> {t("nav.portfolio")}
            </Link>
          </nav>

          <div className="mt-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2 px-1">Language</p>
            <div className="panel-concave rounded-full p-1 flex">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); click(); }}
                  className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition ${
                    lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => { toggleAudio(); }}
              className="panel-concave rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span className="flex items-center gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="block w-[2px] rounded-full"
                    style={{
                      height: muted ? "6px" : `${6 + ((i * 5) % 12)}px`,
                      animation: muted ? undefined : `wave 1.2s ease-in-out ${i * 0.12}s infinite`,
                      backgroundColor: muted ? "var(--muted-foreground)" : "var(--electric)",
                    }}
                  />
                ))}
              </span>
              {muted ? "Sound off" : "Sound on"}
            </button>
            <button
              onClick={() => { toggleTheme(); click(); }}
              className="panel-concave rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          <div className="mt-auto pt-6">
            {user ? (
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                onClick={() => { setOpen(false); click(); }}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-[0_10px_30px_-10px_var(--primary)]"
              >
                <LayoutDashboard className="h-4 w-4" />
                {isAdmin ? "Admin panel" : "Open portal"}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => { setOpen(false); click(); }}
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-2xl panel-concave text-sm font-bold"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => { setOpen(false); click(); }}
                  className="inline-flex items-center justify-center h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-[0_10px_30px_-10px_var(--primary)]"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
