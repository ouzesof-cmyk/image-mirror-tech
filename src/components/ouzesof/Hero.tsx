// @ts-nocheck
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/ouzesof/hero-cinematic.jpg";
import { MagneticButton } from "./MagneticButton";
import { useContent } from "@/hooks/use-content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { t } = useContent();

  return (
    <section ref={ref} id="top" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImg} alt="Cinematic film direction" width={1920} height={1080} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/40" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.4em] text-gold/80 mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-gold" />
          <span className="flicker">{t("hero.eyebrow", "EST. 2019 — CINEMATIC PRODUCTION")}</span>
        </div>

        <h1 className="font-display text-[14vw] md:text-[10vw] leading-[0.9] tracking-[-0.04em]">
          <span className="block overflow-hidden">
            <span className="rise-in block" style={{ animationDelay: "0.2s" }}>{t("hero.title_1", "We don't edit videos.")}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="rise-in block italic text-gold" style={{ animationDelay: "0.5s" }}>
              {t("hero.title_2", "We craft experiences.")}
            </span>
          </span>
        </h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }} className="mt-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
          <MagneticButton variant="primary">{t("hero.cta", "View Portfolio")}</MagneticButton>
          <MagneticButton variant="ghost">Book a Project</MagneticButton>
          <div className="hidden md:block ml-auto max-w-xs font-sans text-sm text-bone/50 leading-relaxed">
            {t("hero.subtitle", "A film studio engineering emotion through frame, light, and silence — for the world's most discerning brands.")}
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-8 right-6 md:right-12 font-mono text-[10px] tracking-[0.3em] text-bone/40 flex items-center gap-3 z-10">
        <span>SCROLL</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-10 bg-gold/60" />
      </motion.div>
    </section>
  );
}
