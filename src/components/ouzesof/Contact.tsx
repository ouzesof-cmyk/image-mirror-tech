// @ts-nocheck
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="relative py-32 md:py-48 px-6 md:px-12 border-t border-gold/15">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-gold" /><span>06 — COMMISSION A FILM</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-6xl md:text-[10vw] leading-[0.95] tracking-[-0.03em] text-bone">
            Let's make<br />
            <span className="italic text-gold">something</span> rare.
          </h2>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-12 gap-12">
          <Reveal delay={0.2} className="md:col-span-5">
            <p className="text-bone/60 leading-relaxed text-lg max-w-md">
              We accept a limited number of commissions each season. Tell us about your project — we typically respond within 48 hours.
            </p>
            <div className="mt-12 space-y-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">Studio</div>
                <div className="text-bone">12 Rue des Lumières, Paris 75003</div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">Direct</div>
                <a href="mailto:hello@ouzesof.film" className="text-gold hover:underline">hello@ouzesof.film</a>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">Press</div>
                <a href="mailto:press@ouzesof.film" className="text-bone hover:text-gold transition-colors">press@ouzesof.film</a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3} className="md:col-span-7">
            <form className="space-y-8">
              {[
                { l: "Your name", t: "text" },
                { l: "Email", t: "email" },
                { l: "Brand / Company", t: "text" },
              ].map((f) => (
                <div key={f.l}>
                  <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-3">{f.l}</label>
                  <input
                    type={f.t}
                    className="w-full bg-transparent border-b border-gold/20 pb-3 text-bone text-lg focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-3">Tell us about the project</label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-gold/20 pb-3 text-bone text-lg focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
              <div className="pt-6">
                <MagneticButton variant="primary">Send Inquiry</MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
