// @ts-nocheck
import { Reveal } from "./Reveal";
import { useState } from "react";

const services = [
  { n: "01", t: "Commercial Films", d: "High-impact campaigns engineered for global brands. From concept to broadcast master.", tags: ["TVC", "Digital", "Cinema"] },
  { n: "02", t: "Brand Cinema", d: "Long-form narrative films that articulate the soul of a brand. Cannes-grade craft.", tags: ["Narrative", "Documentary"] },
  { n: "03", t: "Luxury Productions", d: "Discreet, white-glove production for private commissions and luxury maisons.", tags: ["Fashion", "Automotive", "Jewelry"] },
  { n: "04", t: "Showreels & Edits", d: "Editorial work that transforms raw footage into cinematic statements.", tags: ["Color", "Sound", "Edit"] },
  { n: "05", t: "Social Cinema", d: "Vertical-first storytelling crafted for the algorithm without sacrificing craft.", tags: ["Reels", "Vertical", "Series"] },
];

export function Services() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section id="services" className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto">
      <Reveal>
        <div className="flex items-end justify-between mb-20">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-gold" /><span>02 — DISCIPLINES</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-bone tracking-tight">
              What we <span className="italic text-gold">make.</span>
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="border-t border-gold/15">
        {services.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <div
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative grid grid-cols-12 gap-4 py-10 md:py-14 border-b border-gold/15 transition-all duration-700 cursor-pointer overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ transform: hover === i ? "translateY(0)" : "translateY(101%)" }}
              />
              <div className={`relative col-span-2 md:col-span-1 font-mono text-xs tracking-[0.2em] transition-colors duration-700 ${hover === i ? "text-ink" : "text-gold"}`}>
                {s.n}
              </div>
              <div className="relative col-span-10 md:col-span-5">
                <div className={`font-display text-3xl md:text-5xl tracking-tight transition-colors duration-700 ${hover === i ? "text-ink italic" : "text-bone"}`}>
                  {s.t}
                </div>
              </div>
              <div className={`relative hidden md:block col-span-4 text-sm leading-relaxed transition-colors duration-700 ${hover === i ? "text-ink/80" : "text-bone/50"}`}>
                {s.d}
              </div>
              <div className={`relative hidden md:flex col-span-2 items-center justify-end gap-2 flex-wrap transition-colors duration-700 ${hover === i ? "text-ink/70" : "text-bone/40"}`}>
                {s.tags.map((t) => (
                  <span key={t} className="font-mono text-[10px] tracking-[0.2em] uppercase">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
