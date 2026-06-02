import { useT } from "@/providers/AppProviders";

const clients = [
  "SARL World of Building",
  "EURL Palma",
  "Residence Auralis",
  "Batimex",
  "Studio Nord",
  "Maison Verre",
  "Atelier Cinq",
  "Cobalt Group",
  "Nova Architects",
  "Lumen Co.",
  "Mirage Studio",
  "Helios Group",
];

export function ClientsRectangle() {
  const { t } = useT();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="panel-convex rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
              {t("marquee.title")}
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-4xl font-black tracking-[-0.03em]">
              {t("marquee.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {clients.map((name) => (
              <div
                key={name}
                className="panel-concave rounded-xl px-4 py-5 text-center text-sm font-bold tracking-tight text-muted-foreground hover:text-[var(--electric)] transition border border-border/40"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
