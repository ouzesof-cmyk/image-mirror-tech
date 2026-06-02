import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useT, useAudio } from "@/providers/AppProviders";

export function AboutSection() {
  const { t } = useT();
  const { click } = useAudio();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top meta row */}
        <div className="flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
          <span>© OUZESOF Studio</span>
          <span className="h-px w-16 bg-foreground/20" />
          <span>(OZS — 02)</span>
        </div>
        <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-[var(--electric)]">
          Creative Development
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          {/* Headline */}
          <h2 className="lg:col-span-7 font-serif font-normal text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em]">
            <span className="text-[var(--halogen)]">11+</span>{" "}
            {t("about.title")}
          </h2>

          {/* Right description */}
          <div className="lg:col-span-5 lg:pl-8">
            <div className="mb-8 inline-flex h-3 w-3 rounded-full ring-1 ring-foreground/30 items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--halogen)]" />
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {t("about.subtitle")}
            </p>
          </div>
        </div>

        {/* Contact button */}
        <div className="mt-12">
          <Link
            to="/contact"
            onClick={click}
            className="group inline-flex items-center gap-3 rounded-md border border-foreground/30 px-7 py-3.5 text-sm font-medium hover:bg-foreground hover:text-background transition"
          >
            Contact
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
