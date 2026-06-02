import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Play,
  Maximize2,
  Film,
  Crosshair,
  Wand2,
  Palette,
  PlusCircle,
  X,
} from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";
import { usePortfolio, type PortfolioMedia } from "@/lib/portfolioStore";

type GalleryEntry = {
  id: string;
  url: string;
  caption?: string;
  projectTitle: string;
  kind: "video" | "image" | "link";
};

function toEmbed(url: string): { type: "iframe" | "video" | "image" | "link"; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u) || u.startsWith("blob:")) return { type: "video", src: u };
  if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(u)) return { type: "image", src: u };
  return { type: "link", src: u };
}


import heroImg from "@/assets/video-hero.jpg";
import dopImg from "@/assets/video-dop.jpg";
import setImg from "@/assets/video-set.jpg";

export function VideographyHub() {
  const { click } = useAudio();
  const { t } = useT();
  const [progress, setProgress] = useState(0.74);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const { store: portfolioStore } = usePortfolio();
  const [lightbox, setLightbox] = useState<GalleryEntry | null>(null);

  const gallery = useMemo<GalleryEntry[]>(() => {
    const items = portfolioStore.videography || [];
    const entries: GalleryEntry[] = [];
    items.forEach((it) => {
      (it.media || []).forEach((m: PortfolioMedia) => {
        if (m.kind === "video" || m.kind === "link" || m.kind === "image") {
          entries.push({
            id: m.id,
            url: m.url,
            caption: m.caption,
            projectTitle: it.title,
            kind: m.kind,
          });
        }
      });
    });
    return entries;
  }, [portfolioStore.videography]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.001));
    }, 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = visualizerRef.current;
    if (!el) return;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const v = Math.min(1, Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const bars = el.querySelectorAll<HTMLDivElement>("[data-bar]");
        bars.forEach((b, i) => {
          const base = 30 + ((i * 17) % 60);
          const h = base + v * 220 * (0.5 + ((i * 13) % 50) / 100);
          b.style.height = `${Math.min(240, h)}px`;
        });
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
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

        {/* Hero cinematic */}
        <section className="mb-16">
          <div className="relative w-full overflow-hidden rounded-3xl panel-convex group" style={{ aspectRatio: "21/9" }}>
            <img
              src={heroImg}
              alt="Cinematic Media Production"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-[var(--electric)] mb-3">
                {t("video.hub.tag")}
              </span>
              <h1 className="font-display font-black text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em] max-w-3xl">
                {t("video.hub.h1")}
              </h1>
            </div>

            {/* Scrubber */}
            <div className="absolute left-4 right-4 bottom-4 sm:left-8 sm:right-8 sm:bottom-6 h-12 frosted rounded-full px-5 flex items-center gap-4 border border-white/15">
              <button onClick={click} className="text-white hover:text-[var(--electric)] transition">
                <Play className="h-5 w-5 fill-current" />
              </button>
              <div className="flex-grow h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--electric)] glow-aura"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap tabular-nums">
                {format(progress * 480)} / 08:00
              </div>
              <button onClick={click} className="text-white hover:text-[var(--electric)] transition">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* DOP Profile */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="panel-convex rounded-full p-3">
              <div className="aspect-square rounded-full overflow-hidden panel-concave">
                <img
                  src={dopImg}
                  alt="Director of Photography"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
                {t("video.hub.dept")}
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">
                {t("video.hub.dept.title")}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {t("video.hub.dept.desc")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[t("video.hub.badge1"), t("video.hub.badge2")].map((b) => (
                  <span
                    key={b}
                    className="panel-concave rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Services bento */}
        <section className="mb-20">
          <h3 className="text-center font-display text-3xl sm:text-4xl font-black tracking-[-0.02em] mb-10">
            {t("video.hub.services")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 panel-convex rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <Film className="h-12 w-12 text-[var(--electric)] mb-5" />
                <h4 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                  {t("video.hub.f1.t")}
                </h4>
                <p className="text-muted-foreground max-w-sm">
                  {t("video.hub.f1.d")}
                </p>
              </div>
              <button
                onClick={click}
                className="relative z-10 self-start mt-6 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase px-6 py-3 rounded-full hover:scale-105 transition"
              >
                {t("video.hub.f1.cta")}
              </button>
              <img
                src={setImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-25 transition-opacity duration-700"
              />
            </div>

            <div className="md:col-span-2 panel-convex rounded-3xl p-6 flex items-center gap-5">
              <div className="panel-concave rounded-2xl p-4 shrink-0">
                <Crosshair className="h-8 w-8 text-[var(--electric)]" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{t("video.hub.f2.t")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("video.hub.f2.d")}
                </p>
              </div>
            </div>

            <div className="panel-convex rounded-3xl p-6 flex flex-col justify-center">
              <Wand2 className="h-8 w-8 text-[var(--electric)] mb-3" />
              <h4 className="font-bold text-lg">{t("video.hub.f3.t")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("video.hub.f3.d")}
              </p>
            </div>

            <div className="panel-convex rounded-3xl p-6 flex flex-col justify-center">
              <Palette className="h-8 w-8 text-[var(--electric)] mb-3" />
              <h4 className="font-bold text-lg">{t("video.hub.f4.t")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("video.hub.f4.d")}
              </p>
            </div>
          </div>
        </section>

        {/* Atmospheric visualizer */}
        <section>
          <div
            ref={visualizerRef}
            className="panel-concave rounded-3xl h-72 relative flex items-center justify-center overflow-hidden cursor-crosshair"
          >
            <div className="z-10 pointer-events-none text-center px-6">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-[var(--electric)] mb-3">
                {t("video.hub.viz.tag")}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em]">
                {t("video.hub.viz.title")}
              </h3>
            </div>
            <div className="absolute inset-0 flex items-end justify-around px-6 pb-6 pointer-events-none">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  data-bar
                  className="w-1 rounded-full bg-[var(--electric)]/40 transition-[height] duration-300"
                  style={{ height: `${30 + ((i * 17) % 60)}px` }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery — linked to Admin → Portfolio → Videography */}
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-[var(--electric)] mb-2">
                /gallery
              </p>
              <h3 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">
                Reel Vault
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                Curated from the videography archive. Add, edit, or remove entries from the admin portfolio manager.
              </p>
            </div>
            <Link
              to="/admin"
              onClick={click}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:scale-[1.03] transition"
            >
              <PlusCircle className="h-4 w-4" /> Manage in Admin
            </Link>
          </div>

          {gallery.length === 0 ? (
            <div className="panel-concave rounded-3xl p-12 text-center">
              <Film className="h-10 w-10 mx-auto text-[var(--electric)] mb-3 opacity-70" />
              <p className="text-sm text-muted-foreground">
                No videos yet. Open the admin dashboard, go to Portfolio → Videography, and add your first project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((g) => {
                const embed = toEmbed(g.url);
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      click();
                      setLightbox(g);
                    }}
                    className="group text-left panel-convex rounded-2xl overflow-hidden border border-border/40 hover:border-[var(--electric)]/60 transition"
                  >
                    <div className="aspect-video relative bg-black/40 overflow-hidden">
                      {embed.type === "image" ? (
                        <img src={embed.src} alt={g.caption || g.projectTitle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      ) : embed.type === "video" ? (
                        <video src={embed.src} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                      ) : embed.type === "iframe" ? (
                        <img
                          src={
                            embed.src.includes("youtube")
                              ? `https://img.youtube.com/vi/${embed.src.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg`
                              : ""
                          }
                          alt={g.caption || g.projectTitle}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                          onError={(e) => ((e.currentTarget.style.display = "none"))}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="h-14 w-14 rounded-full bg-[var(--electric)]/90 flex items-center justify-center">
                          <Play className="h-6 w-6 text-black fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm truncate">{g.caption || g.projectTitle}</h4>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1 truncate">
                        {g.projectTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const embed = toEmbed(lightbox.url);
              if (embed.type === "iframe")
                return (
                  <iframe
                    src={embed.src}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                );
              if (embed.type === "video")
                return <video src={embed.src} controls autoPlay className="w-full h-full object-contain" />;
              if (embed.type === "image")
                return <img src={embed.src} alt={lightbox.caption || ""} className="w-full h-full object-contain" />;
              return (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <a href={embed.src} target="_blank" rel="noreferrer" className="underline">
                    Open link ↗
                  </a>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
