import { Link } from "@tanstack/react-router";
import {
  Brush,
  Code2,
  Camera,
  Film,
  TrendingUp,
  Box,
  ArrowUpRight,
} from "lucide-react";
import { useT, useAudio } from "@/providers/AppProviders";
import type { ComponentType } from "react";

type Slug =
  | "branding"
  | "web"
  | "photography"
  | "videography"
  | "marketing"
  | "3d";

const cards: {
  slug: Slug;
  titleKey: string;
  descKey: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  effect: string;
}[] = [
  { slug: "branding", titleKey: "portfolio.branding", descKey: "portfolio.branding.desc", Icon: Brush, accent: "from-amber-400/30 to-rose-400/20", effect: "Metallic ink" },
  { slug: "web", titleKey: "portfolio.web", descKey: "portfolio.web.desc", Icon: Code2, accent: "from-sky-400/30 to-violet-500/20", effect: "Terminal chirp" },
  { slug: "photography", titleKey: "portfolio.photo", descKey: "portfolio.photo.desc", Icon: Camera, accent: "from-zinc-200/30 to-zinc-500/20", effect: "Aperture click" },
  { slug: "videography", titleKey: "portfolio.video", descKey: "portfolio.video.desc", Icon: Film, accent: "from-indigo-500/30 to-fuchsia-500/20", effect: "Tape engage" },
  { slug: "marketing", titleKey: "portfolio.marketing", descKey: "portfolio.marketing.desc", Icon: TrendingUp, accent: "from-emerald-400/30 to-cyan-500/20", effect: "Data tick" },
  { slug: "3d", titleKey: "portfolio.3d", descKey: "portfolio.3d.desc", Icon: Box, accent: "from-orange-400/30 to-red-500/20", effect: "Sub-bass sweep" },
];

export function PortfolioCarousel() {
  const { t } = useT();
  const { click } = useAudio();

  return (
    <section id="portfolio" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("nav.portfolio")}
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-[-0.03em]">
            {t("portfolio.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("portfolio.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Link
              key={c.slug}
              to={`/portfolio/${c.slug}` as string}
              onClick={click}
              className="group relative block rounded-3xl panel-convex p-7 overflow-hidden transition duration-500 hover:-translate-y-1 hover:[box-shadow:var(--shadow-aura)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br ${c.accent} blur-3xl opacity-50 group-hover:opacity-90 transition duration-700`} />

              <div className="relative flex flex-col h-full min-h-[260px]">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl panel-concave flex items-center justify-center text-[var(--electric)]">
                    <c.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-2xl font-bold tracking-tight">
                  {t(c.titleKey)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {t(c.descKey)}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {c.effect}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--electric)] group-hover:gap-2 transition-all">
                    {t("portfolio.enter")}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
