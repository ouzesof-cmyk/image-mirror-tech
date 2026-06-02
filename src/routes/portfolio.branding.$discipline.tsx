import { useRef } from "react";
import {
  createFileRoute,
  Link,
  useParams,
  notFound,
} from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";
import {
  BRANDING_DISCIPLINES,
  getBrandingDiscipline,
} from "@/lib/brandingDisciplines";

import work1 from "@/assets/branding/work-1.jpg";
import work2 from "@/assets/branding/work-2.jpg";
import work3 from "@/assets/branding/work-3.jpg";
import work4 from "@/assets/branding/work-4.jpg";
import svc1 from "@/assets/branding/svc-1.jpg";
import svc2 from "@/assets/branding/svc-2.jpg";
import svc3 from "@/assets/branding/svc-3.jpg";
import svc4 from "@/assets/branding/svc-4.jpg";
import svc5 from "@/assets/branding/svc-5.jpg";
import svc6 from "@/assets/branding/svc-6.jpg";

const WORK_IMAGES = [work1, svc1, work2, svc2, work3, svc3, work4, svc4, svc5, svc6];

export const Route = createFileRoute("/portfolio/branding/$discipline")({
  beforeLoad: ({ params }) => {
    if (!getBrandingDiscipline(params.discipline)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.discipline.replace("-", " ")} — Branding Service · OUZESOF`,
      },
      {
        name: "description",
        content:
          "Explore this branding discipline in detail — what's included, how we work, and selected pieces from our archive.",
      },
    ],
  }),
  component: DisciplineDetail,
  notFoundComponent: () => (
    <section className="pt-36 pb-24 text-center">
      <p className="text-muted-foreground">Not found.</p>
      <Link to="/portfolio/$slug" params={{ slug: "branding" }} className="text-[var(--electric)]">
        Back to Branding
      </Link>
    </section>
  ),
});

/* ============================================================
   Works carousel
   ============================================================ */
function WorksCarousel() {
  const { t } = useT();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("branding.d.works.tag")}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
            {t("branding.d.works.title")}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full panel-convex text-foreground hover:text-[var(--electric)] transition"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full panel-convex text-foreground hover:text-[var(--electric)] transition"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {WORK_IMAGES.map((src, i) => (
          <figure
            key={i}
            className="group relative shrink-0 snap-start panel-convex rounded-3xl overflow-hidden"
            style={{ width: "clamp(240px, 40vw, 420px)" }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={src}
                alt={`Work ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Detail page
   ============================================================ */
function DisciplineDetail() {
  const { discipline } = useParams({ from: "/portfolio/branding/$discipline" });
  const { t } = useT();
  const { click } = useAudio();
  const item = getBrandingDiscipline(discipline)!;
  const { Icon, n, schema } = item;

  const features = [1, 2, 3, 4];
  const others = BRANDING_DISCIPLINES.filter((d) => d.slug !== discipline);

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 space-y-20">
        <Link
          to="/portfolio/$slug"
          params={{ slug: "branding" }}
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t("branding.d.back")}
        </Link>

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[var(--electric)] bg-[var(--electric)]/10 px-3 py-1 rounded-full">
              <Icon className="h-3.5 w-3.5" /> {t("branding.d.hero.tag")}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em]">
              {t(`branding.disc.${n}.t`)}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t(`branding.d.${n}.intro`)}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/contact"
                onClick={click}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition"
              >
                {t("branding.d.cta.start")}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="h-14 w-14 rounded-2xl panel-concave flex items-center justify-center text-[var(--electric)]">
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              {t(`branding.disc.${n}.d`)}
            </p>
          </div>
        </section>

        {/* Schematic diagram */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
              {t("branding.d.schema.tag")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
              {t("branding.d.schema.title")}
            </h2>
            <p className="text-muted-foreground">{t("branding.d.schema.desc")}</p>
          </div>
          <div className="panel-convex rounded-3xl p-4 sm:p-6 overflow-hidden">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={schema}
                alt={`${t(`branding.disc.${n}.t`)} diagram`}
                loading="lazy"
                width={1280}
                height={960}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="space-y-8">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
              {t("branding.d.includes.tag")}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-[-0.03em]">
              {t("branding.d.includes.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f}
                className="panel-convex rounded-2xl p-6 flex gap-4 hover:-translate-y-1 transition duration-500"
              >
                <div className="h-9 w-9 shrink-0 rounded-xl panel-concave flex items-center justify-center text-[var(--electric)]">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    {t(`branding.d.${n}.f${f}.t`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {t(`branding.d.${n}.f${f}.d`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Works carousel */}
        <WorksCarousel />

        {/* Explore other disciplines */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {t("branding.disc.title")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/portfolio/branding/$discipline"
                params={{ discipline: o.slug }}
                onClick={click}
                className="inline-flex items-center gap-2 panel-convex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:text-[var(--electric)] transition"
              >
                <o.Icon className="h-3.5 w-3.5" /> {t(`branding.disc.${o.n}.t`)}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="panel-convex rounded-3xl p-10 sm:p-14 text-center glow-aura">
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.03em]">
            {t("branding.d.cta.title")}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            {t("branding.d.cta.desc")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              onClick={click}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition inline-flex items-center gap-2"
            >
              {t("branding.d.cta.start")} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/portfolio/$slug"
              params={{ slug: "branding" }}
              onClick={click}
              className="px-8 py-4 panel-convex font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t("branding.d.back")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
