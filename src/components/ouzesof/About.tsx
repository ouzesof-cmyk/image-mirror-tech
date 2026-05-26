// @ts-nocheck
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-3">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.4em] text-gold flex items-center gap-3">
              <span className="w-6 h-px bg-gold" />
              <span>01 — STUDIO</span>
            </div>
          </Reveal>
        </div>
        <div className="md:col-span-9">
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-7xl leading-[1.05] tracking-[-0.02em] text-bone">
              A boutique film studio built for brands that refuse to be{" "}
              <span className="italic text-gold">forgettable</span>.
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <Reveal delay={0.2}>
              <p className="text-bone/60 leading-relaxed font-light text-lg">
                Founded in the quiet hours between shoots, OUZESOF is a collective of directors, cinematographers, and editors obsessed with the craft of moving image. We work with a small, curated roster of clients each year — by invitation, by intention.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-bone/60 leading-relaxed font-light text-lg">
                Every frame is engineered. Every cut, deliberate. Our films don't chase trends — they outlast them. From private commissions to global campaigns, we deliver work that earns its place on the cutting room floor of cinema history.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gold/15">
              {[
                ["140+", "Films delivered"],
                ["38", "Awards & nominations"],
                ["22", "Countries shot in"],
                ["6yrs", "Crafting cinema"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-5xl md:text-6xl text-gold">{n}</div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
