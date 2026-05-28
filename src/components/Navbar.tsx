import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useAudio, useT, useTheme } from "@/providers/AppProviders";
import { LANGS } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { t, lang, setLang } = useT();
  const { theme, toggle: toggleTheme } = useTheme();
  const { muted, toggle: toggleAudio, click } = useAudio();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 px-4 sm:px-8 flex items-center">
      <div className="mx-auto w-full max-w-7xl frosted rounded-full px-5 sm:px-7 py-3 flex items-center justify-between glow-aura">
        <Link
          to="/"
          onClick={click}
          className="flex items-center group"
          aria-label="OUZESOF"
        >
          <Logo variant="full" className="h-8 w-auto group-hover:scale-[1.03] transition" />
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

        <div className="flex items-center gap-2">
          {/* Audio wave toggle */}
          <button
            onClick={toggleAudio}
            aria-label={t("audio.mute")}
            className="h-10 w-10 rounded-full panel-convex flex items-center justify-center gap-[2px]"
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
            className="h-10 w-10 rounded-full panel-convex flex items-center justify-center"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
