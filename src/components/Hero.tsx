import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useT, useAudio } from "@/providers/AppProviders";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  const { t } = useT();
  const { click } = useAudio();

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-40 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full blur-[120px] bg-[var(--electric)] opacity-20" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full blur-[100px] bg-[var(--halogen)] opacity-25" />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="inline-flex items-center gap-2 frosted rounded-full px-4 py-1.5 text-xs font-medium animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-[var(--halogen)]" />
          <span>OUZESOF · Annaba · Algeria</span>
        </div>

        <h1
          className="mt-8 font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.03em] animate-slide-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          <span className="text-gradient">{t("hero.title")}</span>
        </h1>

        <p
          className="mx-auto mt-7 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.25s", opacity: 0 }}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <Link
            to="/contact"
            onClick={click}
            className="group relative inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 font-semibold text-sm glow-aura hover:scale-[1.02] transition"
          >
            {t("hero.cta")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            <span className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />
          </Link>
          <a
            href="#portfolio"
            onClick={click}
            className="inline-flex items-center gap-2 rounded-full panel-convex px-6 py-3.5 font-semibold text-sm"
          >
            {t("nav.portfolio")}
          </a>
        </div>
      </div>
    </section>
  );
}
