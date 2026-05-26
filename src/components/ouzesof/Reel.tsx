// @ts-nocheck
import { Reveal } from "./Reveal";
import heroImg from "@/assets/ouzesof/hero-cinematic.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useContent } from "@/hooks/use-content";
import { VideoModal } from "./VideoModal";

export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const { t } = useContent();
  const [open, setOpen] = useState(false);
  const url = t("reel.url", "");

  return (
    <section id="reel" ref={ref} className="relative py-32 md:py-48 overflow-hidden">
      <Reveal>
        <div className="text-center px-6 mb-20">
          <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-6">{t("reel.eyebrow", "04 — SHOWREEL 2025")}</div>
          <h2 className="font-display text-5xl md:text-8xl text-bone tracking-tight max-w-4xl mx-auto leading-[1.05]">
            {t("reel.title_1", "Three minutes of")} <span className="italic text-gold">{t("reel.title_2", "obsession.")}</span>
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <button
            type="button"
            onClick={() => url && setOpen(true)}
            className="relative aspect-video overflow-hidden group cursor-pointer w-full block"
          >
            <motion.img src={heroImg} alt="Showreel" loading="lazy" style={{ scale }} className="absolute inset-0 w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors duration-700" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div whileHover={{ scale: 1.1 }} className="w-28 h-28 md:w-40 md:h-40 rounded-full border-2 border-gold flex items-center justify-center text-gold pulse-glow backdrop-blur-sm bg-ink/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </motion.div>
              <div className="mt-8 font-mono text-[11px] tracking-[0.4em] text-bone/80">PLAY REEL — 03:24</div>
            </div>

            {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c, i) => (
              <div key={i} className={`absolute w-8 h-8 border-gold ${c}`} />
            ))}
          </button>
        </div>
      </Reveal>

      <VideoModal url={open ? url : null} onClose={() => setOpen(false)} />
    </section>
  );
}
