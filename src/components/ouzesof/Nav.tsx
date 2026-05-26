// @ts-nocheck
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled ? "py-4 backdrop-blur-xl bg-ink/70 border-b border-gold/10" : "py-8"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#top" className="font-display text-xl tracking-[0.3em] text-bone hover:text-gold transition-colors">
          OUZESOF
        </a>
        <div className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
          {["Work", "Services", "About", "Reel", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-gold transition-colors duration-500">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a href="/admin" className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40 hover:text-gold transition-colors hidden md:inline">Admin</a>
          <a href="#contact" className="font-mono text-[11px] uppercase tracking-[0.25em] border border-gold/40 px-5 py-2.5 text-gold hover:bg-gold hover:text-ink transition-colors duration-500">
            Book Project
          </a>
        </div>
      </div>
    </nav>
  );
}
