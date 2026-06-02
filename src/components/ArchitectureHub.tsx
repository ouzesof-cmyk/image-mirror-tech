import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Compass,
  Layers,
  ChevronsLeftRight,
  MapPin,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Pause,
  Play,
} from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";

import heroImg from "@/assets/arch-hero.jpg";
import renderImg from "@/assets/arch-render.jpg";
import blueprintImg from "@/assets/arch-blueprint.jpg";
import archZenith from "@/assets/arch-zenith.jpg";
import archPenthouse from "@/assets/arch-penthouse.jpg";
import archEcoNexus from "@/assets/arch-econexus.jpg";
import archAurora from "@/assets/arch-aurora.jpg";
import archVilla from "@/assets/arch-villa.jpg";
import archSkyline from "@/assets/arch-skyline.jpg";
import archLumen from "@/assets/arch-lumen.jpg";
import archHelix from "@/assets/arch-helix.jpg";
import archMeridian from "@/assets/arch-meridian.jpg";
import archObsidian from "@/assets/arch-obsidian.jpg";

type OrbitItem = { title: string; sub: string; img: string };

const defaultProjects: OrbitItem[] = [
  { title: "The Zenith Tower", sub: "Exterior Rendering", img: archZenith },
  { title: "Penthouse X", sub: "Interior Lighting Study", img: archPenthouse },
  { title: "Eco-Nexus Hub", sub: "Structural Animation", img: archEcoNexus },
  { title: "Aurora Heights", sub: "Mixed-Use Tower", img: archAurora },
  { title: "Villa Solenne", sub: "Coastal Residence", img: archVilla },
  { title: "Skyline Atrium", sub: "Corporate HQ", img: archSkyline },
  { title: "Lumen Pavilion", sub: "Cultural Space", img: archLumen },
  { title: "Helix Residences", sub: "Vertical Garden", img: archHelix },
  { title: "Project Meridian", sub: "Master Plan", img: archMeridian },
  { title: "Studio Obsidian", sub: "Private Atelier", img: archObsidian },
];

const STORAGE_KEY = "ouzesof.orbit.items";
const ADMIN_KEY = "ouzesof.admin";
const ADMIN_PASS = "admin";

export function ArchitectureHub() {
  const { click } = useAudio();
  const { t } = useT();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  // Orbit state
  const [items, setItems] = useState<OrbitItem[]>(defaultProjects);
  const [admin, setAdmin] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<OrbitItem>({ title: "", sub: "", img: "" });

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrbitItem[];
        if (Array.isArray(parsed) && parsed.length) setItems(parsed);
      }
      setAdmin(localStorage.getItem(ADMIN_KEY) === "1");
    } catch {}
  }, []);

  // Persist items
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const toggleAdmin = () => {
    if (admin) {
      setAdmin(false);
      localStorage.removeItem(ADMIN_KEY);
      setShowAdd(false);
      return;
    }
    const pass = window.prompt("Admin passcode");
    if (pass === ADMIN_PASS) {
      setAdmin(true);
      localStorage.setItem(ADMIN_KEY, "1");
    } else if (pass !== null) {
      window.alert("Incorrect passcode");
    }
  };

  const addItem = () => {
    if (!draft.img.trim()) return;
    setItems((s) => [
      ...s,
      {
        title: draft.title.trim() || `Project ${s.length + 1}`,
        sub: draft.sub.trim() || "Visualization",
        img: draft.img.trim(),
      },
    ]);
    setDraft({ title: "", sub: "", img: "" });
    setShowAdd(false);
  };

  const removeItem = (idx: number) =>
    setItems((s) => s.filter((_, i) => i !== idx));

  const resetItems = () => setItems(defaultProjects);

  // Compute radius so cards don't overlap regardless of count
  const cardWidth = 220;
  const radius = useMemo(() => {
    const n = Math.max(items.length, 3);
    const r = (cardWidth / 2) / Math.tan(Math.PI / n);
    return Math.max(r + 40, 360);
  }, [items.length]);


  useEffect(() => {
    const move = (clientX: number) => {
      const el = sliderRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setPos(p);
    };
    const onMouseMove = (e: MouseEvent) => dragging.current && move(e.clientX);
    const onTouchMove = (e: TouchEvent) => dragging.current && move(e.touches[0].clientX);
    const stop = () => (dragging.current = false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        {/* Hero: asymmetric CAD interface */}
        <section className="grid grid-cols-12 gap-6 items-center mb-32">
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">
              {t("arch.hub.tag")}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.05]">
              {t("arch.hub.h1")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              {t("arch.hub.desc")}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={click}
                className="panel-convex rounded-full px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric)] hover:scale-[1.02] transition"
              >
                {t("arch.hub.cta.vault")}
              </button>
              <button
                onClick={click}
                className="bg-primary text-primary-foreground rounded-full px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-[1.02] transition glow-aura"
              >
                {t("arch.hub.cta.start")}
              </button>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 relative h-[460px] sm:h-[560px]">
            <div className="w-full h-full panel-convex rounded-3xl p-3 overflow-hidden relative group">
              <img
                src={heroImg}
                alt="Lead 3D Visualization Engineer at CAD workstation"
                className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent rounded-2xl" />
              <div className="absolute top-6 left-6 frosted rounded-xl p-4 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--electric)] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                    {t("arch.hub.engineer")}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[var(--electric)]/80 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> 52.5200° N · 13.4050° E
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Execution */}
        <section className="mb-32">
          <h2 className="text-center font-display text-3xl sm:text-4xl font-black tracking-[-0.02em] mb-12">
            {t("arch.hub.exec.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="panel-convex rounded-3xl p-8 flex flex-col gap-4">
              <Building2 className="h-10 w-10 text-[var(--electric)]" />
              <h3 className="font-display text-2xl font-bold">{t("arch.hub.exec1.t")}</h3>
              <p className="text-muted-foreground">{t("arch.hub.exec1.d")}</p>
            </div>
            <div className="panel-concave rounded-3xl p-8 flex flex-col gap-4">
              <Compass className="h-10 w-10 text-[var(--electric)]" />
              <h3 className="font-display text-2xl font-bold">{t("arch.hub.exec2.t")}</h3>
              <p className="text-muted-foreground">{t("arch.hub.exec2.d")}</p>
            </div>
            <div className="panel-convex rounded-3xl p-8 flex flex-col gap-4">
              <Layers className="h-10 w-10 text-[var(--electric)]" />
              <h3 className="font-display text-2xl font-bold">{t("arch.hub.exec3.t")}</h3>
              <p className="text-muted-foreground">{t("arch.hub.exec3.d")}</p>
            </div>
          </div>
        </section>

        {/* Project Orbit */}
        <section className="mb-32 relative h-[720px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[760px] h-[760px] border border-[var(--electric)] rounded-full" />
            <div className="absolute w-[560px] h-[560px] border border-[var(--electric)]/60 rounded-full" />
          </div>
          <div className="text-center z-10 absolute pointer-events-none top-6">
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-[-0.03em]">
              {t("arch.hub.orbit.title")}
            </h2>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)] mt-3">
              {items.length} {t("arch.hub.orbit.sub")}
            </p>
          </div>

          {/* Admin controls */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={() => setPaused((p) => !p)}
              className="panel-convex rounded-full p-2.5 text-[var(--electric)] hover:scale-105 transition"
              aria-label={paused ? "Play orbit" : "Pause orbit"}
              title={paused ? "Play" : "Pause"}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleAdmin}
              className="panel-convex rounded-full p-2.5 text-[var(--electric)] hover:scale-105 transition"
              aria-label={admin ? "Disable admin" : "Enable admin"}
              title={admin ? "Admin: ON" : "Enable admin"}
            >
              {admin ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
            {admin && (
              <>
                <button
                  onClick={() => setShowAdd((s) => !s)}
                  className="panel-convex rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric)] flex items-center gap-1.5 hover:scale-105 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> {t("arch.hub.admin.add")}
                </button>
                <button
                  onClick={resetItems}
                  className="panel-convex rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-[var(--electric)] transition"
                  title="Reset to defaults"
                >
                  {t("arch.hub.admin.reset")}
                </button>
              </>
            )}
          </div>

          {/* Add image form */}
          {admin && showAdd && (
            <div className="absolute top-20 right-4 z-30 panel-convex rounded-2xl p-5 w-[320px] bg-background/95 backdrop-blur space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--electric)]">
                {t("arch.hub.admin.new")}
              </p>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder={t("arch.hub.admin.title")}
                className="w-full panel-concave rounded-lg px-3 py-2 text-sm bg-transparent outline-none"
              />
              <input
                value={draft.sub}
                onChange={(e) => setDraft({ ...draft, sub: e.target.value })}
                placeholder={t("arch.hub.admin.subtitle")}
                className="w-full panel-concave rounded-lg px-3 py-2 text-sm bg-transparent outline-none"
              />
              <input
                value={draft.img}
                onChange={(e) => setDraft({ ...draft, img: e.target.value })}
                placeholder={t("arch.hub.admin.img")}
                className="w-full panel-concave rounded-lg px-3 py-2 text-sm bg-transparent outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={addItem}
                  className="flex-1 bg-primary text-primary-foreground rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  {t("arch.hub.admin.addBtn")}
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="panel-convex rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  {t("arch.hub.admin.cancel")}
                </button>
              </div>
            </div>
          )}

          <div className="orbit-stage absolute inset-0 flex items-center justify-center">
            <div
              className="orbit-ring relative"
              style={{ animationPlayState: paused ? "paused" : "running" }}
            >
              {items.map((p, i) => {
                const angle = (360 / items.length) * i;
                return (
                  <div
                    key={`${p.title}-${i}`}
                    className="orbit-card absolute panel-convex rounded-2xl p-3 bg-background left-1/2 top-1/2"
                    style={{
                      width: `${cardWidth}px`,
                      height: "300px",
                      marginLeft: `-${cardWidth / 2}px`,
                      marginTop: "-150px",
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    }}
                  >
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-44 object-cover rounded-xl"
                    />
                    <div className="p-2">
                      <h4 className="font-bold text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {p.sub}
                      </p>
                    </div>
                    {admin && (
                      <button
                        onClick={() => removeItem(i)}
                        className="absolute top-2 right-2 panel-convex rounded-full p-1.5 text-destructive hover:scale-110 transition"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Vault: Residence Auralis slider */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
                {t("arch.hub.vault.tag")}
              </span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl font-black tracking-[-0.03em]">
                {t("arch.hub.vault.title")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm md:text-right">
              {t("arch.hub.vault.desc")}
            </p>
          </div>
          <div
            ref={sliderRef}
            className="relative w-full aspect-video rounded-3xl overflow-hidden panel-convex select-none"
          >
            <img
              src={renderImg}
              alt="Residence Auralis render"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${pos}%` }}
            >
              <img
                src={blueprintImg}
                alt="Residence Auralis blueprint"
                className="absolute inset-0 h-full w-full object-cover grayscale brightness-110"
                style={{ width: `${(100 / Math.max(pos, 0.01)) * 100}%`, maxWidth: "none" }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-background/30 mix-blend-overlay" />
            </div>
            <div
              className="absolute top-0 bottom-0 w-px bg-[var(--electric)] z-20"
              style={{ left: `${pos}%` }}
            >
              <button
                onMouseDown={() => (dragging.current = true)}
                onTouchStart={() => (dragging.current = true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[var(--electric)] text-background flex items-center justify-center shadow-2xl cursor-ew-resize hover:scale-110 transition glow-aura"
                aria-label="Drag to compare"
              >
                <ChevronsLeftRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .orbit-stage { perspective: 1400px; }
        .orbit-ring {
          width: 1px; height: 1px;
          transform-style: preserve-3d;
          animation: orbit-rotate 32s linear infinite;
        }
        .orbit-card { backface-visibility: hidden; transform-style: preserve-3d; }
        @keyframes orbit-rotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
