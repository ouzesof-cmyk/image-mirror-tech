import { useT } from "@/providers/AppProviders";

const members = [
  { initial: "S", nameEn: "Sofiane Guendouze", roleKey: "team.member1.role", grad: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { initial: "A", nameEn: "Abdelkarim Genfoudi", roleKey: "team.member2.role", grad: "linear-gradient(135deg, #0066ff, #8b5cf6)" },
  { initial: "B", nameEn: "Bilal Belaid", roleKey: "team.member3.role", grad: "linear-gradient(135deg, #14b8a6, #06b6d4)" },
  { initial: "T", nameEn: "Tayga", roleKey: "team.member4.role", grad: "linear-gradient(135deg, #ec4899, #f97316)" },
];

export function TeamGrid() {
  const { t } = useT();
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("team.title")}
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-[-0.03em]">
            {t("team.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("team.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <div
              key={m.nameEn}
              className="group relative rounded-3xl panel-convex p-6 transition hover:[box-shadow:var(--shadow-aura)]"
            >
              <div
                className="relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center text-7xl font-display font-black text-white transition-all duration-500"
                style={{
                  background: m.grad,
                  filter: "grayscale(1) contrast(1.1) brightness(0.85)",
                }}
              >
                <span className="opacity-90">{m.initial}</span>
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: m.grad, mixBlendMode: "normal" }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-7xl font-display font-black text-white">
                    {m.initial}
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-display font-bold text-lg group-hover:text-[var(--electric)] transition">
                  {m.nameEn}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{t(m.roleKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
