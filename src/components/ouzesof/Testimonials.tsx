// @ts-nocheck
import { Reveal } from "./Reveal";

const quotes = [
  {
    q: "OUZESOF didn't just deliver a film. They delivered the soul of our maison in motion.",
    a: "Élise Marchand",
    r: "Creative Director, Maison Veyron",
  },
  {
    q: "Every frame felt deliberate. Every silence, earned. This is cinema for brands.",
    a: "Tomás Reyes",
    r: "Global CMO, Soie de Paris",
  },
  {
    q: "We've worked with the best agencies in Paris and New York. Nothing compares to this craft.",
    a: "Henrik Voss",
    r: "Founder, Côte d'Or Watches",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1400px] mx-auto">
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-16 flex items-center justify-center gap-3">
          <span className="w-6 h-px bg-gold" /><span>05 — IN THEIR WORDS</span><span className="w-6 h-px bg-gold" />
        </div>
      </Reveal>
      <div className="space-y-24 md:space-y-32">
        {quotes.map((qt, i) => (
          <Reveal key={qt.a} delay={i * 0.1}>
            <figure className={`max-w-3xl ${i % 2 === 1 ? "ml-auto text-right" : ""}`}>
              <span className="font-display text-7xl md:text-9xl text-gold leading-none italic">"</span>
              <blockquote className="font-display text-3xl md:text-5xl text-bone leading-tight tracking-tight -mt-6">
                {qt.q}
              </blockquote>
              <figcaption className="mt-8 font-mono text-[11px] tracking-[0.25em] uppercase">
                <div className="text-gold">{qt.a}</div>
                <div className="text-bone/40 mt-1">{qt.r}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
