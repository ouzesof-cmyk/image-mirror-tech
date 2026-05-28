import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/providers/AppProviders";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — OUZESOF" },
      {
        name: "description",
        content:
          "Our philosophy and four-step process: Discovery, Blueprinting, Production, Refinement.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useT();
  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`process.${n}.title`),
    desc: t(`process.${n}.desc`),
  }));

  return (
    <section className="pt-36 pb-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
          {t("nav.about")}
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black tracking-[-0.03em] text-gradient">
          {t("about.title")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {t("about.subtitle")}
        </p>
      </div>

      <div className="mt-24 mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-3xl font-black mb-14">
          {t("about.process")}
        </h2>
        <div className="relative">
          <div className="absolute left-7 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--electric)] via-[var(--halogen)] to-transparent" />
          <ol className="space-y-10">
            {steps.map((s) => (
              <li key={s.n} className="relative flex gap-6 group">
                <div className="relative z-10 flex-shrink-0 h-14 w-14 rounded-2xl panel-convex flex items-center justify-center font-mono text-sm font-bold text-[var(--electric)]">
                  0{s.n}
                </div>
                <div className="flex-1 panel-convex rounded-2xl p-6 transition group-hover:[box-shadow:var(--shadow-aura)]">
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
