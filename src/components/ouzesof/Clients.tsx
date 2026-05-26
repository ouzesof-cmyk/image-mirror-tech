// @ts-nocheck
import { Reveal } from "./Reveal";

const logos = [
  "MAISON VEYRON", "SOIE DE PARIS", "CÔTE D'OR", "AURÉLIA", "NORD ATLAS",
  "OBSCURA", "MONTAGNE", "VELLUM", "SIENNA & CO", "L'HEURE BLEUE",
];

export function Clients() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-12 text-center">
          ENTRUSTED BY
        </div>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gold/10">
        {logos.map((l, i) => (
          <Reveal key={l} delay={i * 0.04}>
            <div className="bg-ink h-32 flex items-center justify-center font-display text-bone/60 hover:text-gold transition-colors duration-700 text-lg md:text-xl tracking-[0.2em] italic">
              {l}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
