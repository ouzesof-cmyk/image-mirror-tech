// @ts-nocheck
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useContent } from "@/hooks/use-content";
import portrait from "@/assets/ouzesof/portrait.jpg";

const EMBER = "#c9a96e";
const SERIF = '"Playfair Display", Georgia, serif';
const MONO = '"JetBrains Mono", monospace';

function parseJSON<T>(s: string | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

export function StudioTrajectory() {
  const { t } = useContent();
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const timeline = parseJSON<{ y: string; t: string }[]>(t("gd.timeline.items", ""), []);

  return (
    <section className="border-t border-bone/10 bg-ink text-bone">
      {/* STUDIO */}
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pt-32 pb-32 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-bone/50" style={{ fontFamily: MONO }}>
            {t("gd.about.eyebrow", "( 04 ) — Studio")}
          </p>
          <h2 className="mt-8 font-light leading-[0.95] tracking-tight text-bone" style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 7vw, 7rem)" }}>
            {t("gd.about.title_pre", "A small studio with an ")}
            <em style={{ color: EMBER, fontStyle: "italic" }}>{t("gd.about.title_em", "obsessive")}</em>
            {t("gd.about.title_post", " eye for type, light and silence.")}
          </h2>
          <div className="mt-12 max-w-xl space-y-6 text-lg text-bone/70">
            <p>{t("gd.about.body1", "")}</p>
            <p>{t("gd.about.body2", "")}</p>
          </div>
        </div>
        <div ref={aboutRef} className="md:col-span-4 md:col-start-9">
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img style={{ y: portraitY }} src={portrait} alt="Studio founder" loading="lazy" className="h-[120%] w-full object-cover" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-widest text-bone/50" style={{ fontFamily: MONO }}>
            {t("gd.about.role", "Taiga · filmmaker")}
          </p>
        </div>
      </div>

      {/* TRAJECTORY */}
      <div className="border-t border-bone/10">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
          <p className="mb-16 text-[11px] uppercase tracking-[0.3em] text-bone/50" style={{ fontFamily: MONO }}>
            {t("gd.timeline.eyebrow", "( 05 ) — Trajectory")}
          </p>
          <ol className="relative ml-8 border-l border-bone/10">
            {timeline.map((m, i) => (
              <motion.li
                key={m.y + i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative grid grid-cols-12 gap-6 py-10 pl-12"
              >
                <span className="absolute -left-[7px] top-12 h-3 w-3 rounded-full" style={{ background: EMBER }} />
                <span className="col-span-2 text-sm" style={{ color: EMBER, fontFamily: MONO }}>{m.y}</span>
                <span className="col-span-10 tracking-tight md:text-3xl text-bone" style={{ fontFamily: SERIF, fontSize: "1.5rem" }}>{m.t}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
