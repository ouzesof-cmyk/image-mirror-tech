import { useT } from "@/providers/AppProviders";

const partners = [
  "SARL World of Building",
  "EURL Palma",
  "Residence Auralis",
  "Batimex",
  "Studio Nord",
  "Maison Verre",
  "Atelier Cinq",
  "Cobalt Group",
];

export function LogoMarquee() {
  const { t } = useT();
  const row = [...partners, ...partners];
  return (
    <section className="py-16 border-y border-border/40">
      <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground mb-8">
        {t("marquee.title")}
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex w-max animate-marquee gap-12 px-6">
          {row.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap text-lg font-bold tracking-tight text-muted-foreground"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--electric)]/60" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
