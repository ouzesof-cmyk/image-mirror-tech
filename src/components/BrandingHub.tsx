import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";
import { useBrandingMedia } from "@/lib/brandingMedia";
import { BRANDING_DISCIPLINES } from "@/lib/brandingDisciplines";

import heroPortrait from "@/assets/branding/hero-portrait.jpg";
import work1 from "@/assets/branding/work-1.jpg";
import work2 from "@/assets/branding/work-2.jpg";
import work3 from "@/assets/branding/work-3.jpg";
import work4 from "@/assets/branding/work-4.jpg";

/* ============================================================
   Hero
   ============================================================ */
function Hero() {
  const { click } = useAudio();
  const { t } = useT();
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-3xl panel-convex p-4 group">
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <img
              src={heroPortrait}
              alt="Graphic Design Direction"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--electric)]/30 via-transparent to-[var(--halogen)]/10" />
          </div>
          <div className="absolute -z-10 inset-0 rounded-3xl blur-3xl bg-[var(--electric)]/20 group-hover:bg-[var(--electric)]/40 transition-all duration-700" />
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[var(--electric)] bg-[var(--electric)]/10 px-3 py-1 rounded-full">
          <Sparkles className="h-3 w-3" /> {t("branding.hero.tag")}
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em]">
          {t("branding.hero.h1.a")}
          <span className="italic text-gradient">{t("branding.hero.h1.b")}</span>.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t("branding.hero.desc")}
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            to="/contact"
            onClick={click}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition"
          >
            {t("branding.hero.cta.start")}
          </Link>
          <a
            href="#works"
            onClick={click}
            className="px-8 py-4 panel-convex font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl"
          >
            {t("branding.hero.cta.works")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Disciplines
   ============================================================ */
function Disciplines() {
  const { t } = useT();
  const { click } = useAudio();
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("branding.disc.tag")}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
            {t("branding.disc.title")}
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          {t("branding.disc.services")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BRANDING_DISCIPLINES.map(({ Icon, n, slug }, i) => (
          <Link
            key={n}
            to="/portfolio/branding/$discipline"
            params={{ discipline: slug }}
            onClick={click}
            className="group panel-convex rounded-2xl p-6 hover:-translate-y-1 transition duration-500"
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl panel-concave flex items-center justify-center text-[var(--electric)]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
              {t(`branding.disc.${n}.t`)}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t(`branding.disc.${n}.d`)}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--electric)] opacity-0 group-hover:opacity-100 transition">
              {t("branding.d.hero.tag")} <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}


/* ============================================================
   Selected Works
   ============================================================ */
const WORKS = [
  { src: work1, title: "Confietár", n: 1, year: "2024" },
  { src: work2, title: "5G Atelier", n: 2, year: "2024" },
  { src: work3, title: "Cuscand", n: 3, year: "2023" },
  { src: work4, title: "Wsen Tower", n: 4, year: "2023" },
];

function SelectedWorks() {
  const { t } = useT();
  return (
    <section id="works" className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("branding.works.tag")}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
            {t("branding.works.title")}
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          {t("branding.works.archive")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKS.map((w, i) => (
          <figure
            key={w.title}
            className="group relative panel-convex rounded-3xl overflow-hidden"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={w.src}
                alt={w.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-80">
                  {t(`branding.works.${w.n}.tag`)} · {w.year}
                </p>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight">
                  {w.title}
                </h3>
              </div>
              <span className="h-10 w-10 rounded-full bg-white text-black grid place-items-center group-hover:rotate-45 transition">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Process
   ============================================================ */
const PROCESS = [
  { step: "01", n: 1 },
  { step: "02", n: 2 },
  { step: "03", n: 3 },
  { step: "04", n: 4 },
];

function Process() {
  const { t } = useT();
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("branding.proc.tag")}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
            {t("branding.proc.title")}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROCESS.map((p) => (
          <div
            key={p.step}
            className="panel-concave rounded-2xl p-6 space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
              {p.step}
            </span>
            <h3 className="font-display text-xl font-bold tracking-tight">
              {t(`branding.proc.${p.n}.t`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`branding.proc.${p.n}.d`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Branding Carousel (admin-managed)
   ============================================================ */
function BrandingCarousel() {
  const { t } = useT();
  const { store, hydrated } = useBrandingMedia();
  const items = store.carousel;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [items.length]);

  useEffect(() => {
    if (index >= items.length && items.length > 0) setIndex(0);
  }, [items.length, index]);

  if (!hydrated || items.length === 0) return null;

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  const offset = (i: number) => {
    const n = items.length;
    let d = i - index;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
          {t("branding.car.tag")}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.03em]">
          {t("branding.car.title.a")}<span className="italic text-gradient">{t("branding.car.title.b")}</span>
        </h2>
        <p className="text-muted-foreground">
          {t("branding.car.desc")}
        </p>
      </div>

      <div
        className="relative mx-auto flex h-[58vh] min-h-[420px] w-full items-center justify-center"
        style={{ perspective: "1800px" }}
      >
        <div className="relative h-full w-full">
          {items.map((m, i) => {
            const d = offset(i);
            const abs = Math.abs(d);
            const visible = abs <= 3;
            const isCenter = d === 0;
            const translateX = d * 26;
            const translateZ = -abs * 80;
            const rotateY = d === 0 ? 0 : d > 0 ? -22 : 22;
            const scale = Math.max(0.5, 1 - abs * 0.13);
            const z = 20 - abs;
            const opacity = abs >= 3 ? 0 : 1;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className="absolute left-1/2 top-1/2 overflow-hidden rounded-3xl panel-convex transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  width: "clamp(220px, 26vw, 400px)",
                  height: "clamp(320px, 60vh, 580px)",
                  transform: `translate3d(-50%, -50%, 0) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: z,
                  opacity,
                  pointerEvents: visible ? "auto" : "none",
                  boxShadow: isCenter
                    ? "var(--shadow-aura)"
                    : "0 20px 40px -20px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={m.url}
                  alt={m.caption || `Slide ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                {!isCenter && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `rgba(10,10,20,${Math.min(0.45, abs * 0.18)})`,
                    }}
                  />
                )}
                {isCenter && m.caption && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em]">
                      {m.caption}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full panel-convex text-foreground hover:text-[var(--electric)] transition md:left-6"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full panel-convex text-foreground hover:text-[var(--electric)] transition md:right-6"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-2">
          {items.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 32 : 10,
                background:
                  i === index
                    ? "var(--electric)"
                    : "color-mix(in oklab, var(--foreground) 25%, transparent)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   Branding Gallery (admin-managed)
   ============================================================ */
function BrandingGallery() {
  const { t } = useT();
  const { store, hydrated } = useBrandingMedia();
  const items = store.gallery;
  if (!hydrated || items.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("branding.gal.tag")}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
            {t("branding.gal.title")}
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          ({String(items.length).padStart(2, "0")} items)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <figure
            key={m.id}
            className="group relative aspect-square overflow-hidden rounded-2xl panel-convex p-2"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={m.url}
                alt={m.caption || ""}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {m.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-transform duration-500 group-hover:translate-y-0">
                  {m.caption}
                </figcaption>
              )}
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
function CTA() {
  const { click } = useAudio();
  const { t } = useT();
  return (
    <section className="panel-convex rounded-3xl p-10 sm:p-14 text-center glow-aura">
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
        {t("branding.cta.tag")}
      </p>
      <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-[-0.03em]">
        {t("branding.cta.title")}
      </h2>
      <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
        {t("branding.cta.desc")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          to="/contact"
          onClick={click}
          className="px-8 py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition"
        >
          {t("branding.cta.start")}
        </Link>
        <Link
          to="/"
          onClick={click}
          className="px-8 py-4 panel-convex font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t("branding.cta.home")}
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   Root
   ============================================================ */
export function BrandingHub() {
  const { click } = useAudio();

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 space-y-20">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        <Hero />
        <Disciplines />
        <SelectedWorks />
        <Process />
        <BrandingCarousel />
        <BrandingGallery />
        <CTA />
      </div>
    </div>
  );
}

export default BrandingHub;
