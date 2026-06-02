import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, LANGS, type Lang } from "@/lib/i18n";

/* ---------- Theme ---------- */
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within AppProviders");
  return ctx;
}

/* ---------- Language ---------- */
const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
} | null>(null);

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useT must be used within AppProviders");
  return ctx;
}

/* ---------- Audio ---------- */
const AudioCtx = createContext<{
  muted: boolean;
  toggle: () => void;
  click: () => void;
  musicUrl: string | null;
  setMusicUrl: (url: string | null) => void;
} | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AppProviders");
  return ctx;
}

/* ---------- Provider ---------- */
export function AppProviders({ children }: { children: ReactNode }) {
  // Theme — default dark for cinematic first impression
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? (localStorage.getItem("ouzesof-theme") as Theme | null)
      : null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ouzesof-theme", theme);
  }, [theme]);

  // Language
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? (localStorage.getItem("ouzesof-lang") as Lang | null)
      : null;
    if (saved && dictionaries[saved]) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ouzesof-lang", l);
  };
  const dir = useMemo(
    () => (LANGS.find((l) => l.code === lang)?.dir ?? "ltr"),
    [lang],
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useMemo(
    () => (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang],
  );

  // Audio — synthesized ambient drone + click tick using WebAudio (no asset required)
  const [muted, setMuted] = useState(true);
  const [musicUrl, setMusicUrlState] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("ouzesof-music-url");
    if (saved) setMusicUrlState(saved);
  }, []);
  const setMusicUrl = (url: string | null) => {
    setMusicUrlState(url);
    if (typeof window === "undefined") return;
    if (url) localStorage.setItem("ouzesof-music-url", url);
    else localStorage.removeItem("ouzesof-music-url");
  };
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<{
    ctx?: AudioContext;
    gain?: GainNode;
    nodes?: OscillatorNode[];
  }>({});

  // Manage HTMLAudioElement when a custom track URL is set
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!musicUrl) {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current.src = "";
        htmlAudioRef.current = null;
      }
      return;
    }
    const el = new Audio(musicUrl);
    el.loop = true;
    el.volume = muted ? 0 : 0.5;
    htmlAudioRef.current = el;
    if (!muted) el.play().catch(() => {});
    return () => {
      el.pause();
      el.src = "";
      htmlAudioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicUrl]);

  const ensureAudio = () => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current.ctx) {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      const ctx = new AC();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      // Slow drone — two detuned sines + a tremolo
      const o1 = ctx.createOscillator();
      o1.type = "sine"; o1.frequency.value = 110;
      const o2 = ctx.createOscillator();
      o2.type = "sine"; o2.frequency.value = 110.4;
      const o3 = ctx.createOscillator();
      o3.type = "triangle"; o3.frequency.value = 220.5;
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass"; filt.frequency.value = 600;
      o1.connect(filt); o2.connect(filt); o3.connect(filt);
      filt.connect(gain);
      o1.start(); o2.start(); o3.start();

      audioRef.current = { ctx, gain, nodes: [o1, o2, o3] };
    }
    return audioRef.current;
  };

  const toggle = () => {
    setMuted((prev) => {
      const next = !prev;
      // Custom track mode
      if (musicUrl) {
        const el = htmlAudioRef.current;
        if (el) {
          el.volume = next ? 0 : 0.5;
          if (next) el.pause();
          else el.play().catch(() => {});
        }
        return next;
      }
      const a = ensureAudio();
      if (!a?.ctx || !a.gain) return next;
      if (a.ctx.state === "suspended") a.ctx.resume();
      const now = a.ctx.currentTime;
      a.gain.gain.cancelScheduledValues(now);
      a.gain.gain.linearRampToValueAtTime(next ? 0 : 0.04, now + 0.6);
      return next;
    });
  };

  const click = () => {
    if (typeof window === "undefined") return;
    const a = ensureAudio();
    if (!a?.ctx) return;
    if (a.ctx.state === "suspended") a.ctx.resume();
    const t0 = a.ctx.currentTime;
    const osc = a.ctx.createOscillator();
    const g = a.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, t0);
    osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.08);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(muted ? 0.04 : 0.12, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    osc.connect(g); g.connect(a.ctx.destination);
    osc.start(t0); osc.stop(t0 + 0.13);
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      <LangCtx.Provider value={{ lang, setLang, t, dir }}>
        <AudioCtx.Provider value={{ muted, toggle, click, musicUrl, setMusicUrl }}>
          {children}
        </AudioCtx.Provider>
      </LangCtx.Provider>
    </ThemeCtx.Provider>
  );
}
