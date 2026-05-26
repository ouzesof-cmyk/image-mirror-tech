// @ts-nocheck
import { Reveal } from "./Reveal";
import w1 from "@/assets/ouzesof/work-1.jpg";
import w2 from "@/assets/ouzesof/work-2.jpg";
import w3 from "@/assets/ouzesof/work-3.jpg";
import w4 from "@/assets/ouzesof/work-4.jpg";
import w5 from "@/assets/ouzesof/work-5.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import { useProjects, useContent, type Project } from "@/hooks/use-content";
import { VideoModal } from "./VideoModal";

const fallback: Project[] = [
  { id: "f1", title: "Nocturne", client: "Maison Veyron", year: "2025", category: "Automotive", image_url: w1, video_url: "", span: "md:col-span-7", sort_order: 0, published: true },
  { id: "f2", title: "Auré", client: "Soie de Paris", year: "2025", category: "Fashion", image_url: w2, video_url: "", span: "md:col-span-5", sort_order: 1, published: true },
  { id: "f3", title: "The Long Road", client: "Independent", year: "2024", category: "Documentary", image_url: w3, video_url: "", span: "md:col-span-5", sort_order: 2, published: true },
  { id: "f4", title: "Heirloom", client: "Côte d'Or Watches", year: "2024", category: "Luxury", image_url: w4, video_url: "", span: "md:col-span-7", sort_order: 3, published: true },
  { id: "f5", title: "Behind The Frame", client: "Studio Internal", year: "2025", category: "Cinema", image_url: w5, video_url: "", span: "md:col-span-12", sort_order: 4, published: true },
];

export function Work() {
  const { projects, loaded } = useProjects();
  const { t } = useContent();
  const [video, setVideo] = useState<string | null>(null);
  const list = loaded && projects.length > 0 ? projects : fallback;

  return (
    <section id="work" className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto">
      <Reveal>
        <div className="flex items-end justify-between mb-20">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-gold" /><span>{t("work.eyebrow", "03 — SELECTED WORK")}</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-bone tracking-tight">
              {t("work.title_1", "Recent")} <span className="italic text-gold">{t("work.title_2", "commissions.")}</span>
            </h2>
          </div>
          <div className="hidden md:block font-mono text-[11px] tracking-[0.25em] uppercase text-bone/40">2024 / 2025 →</div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className={p.span ?? "md:col-span-6"}>
            <motion.button
              type="button"
              onClick={() => p.video_url && setVideo(p.video_url)}
              whileHover="hover"
              className="group relative block w-full text-left overflow-hidden aspect-[4/5] md:aspect-[5/6] cursor-pointer"
            >
              {p.image_url && (
                <motion.img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  variants={{ hover: { scale: 1.06 } }}
                  transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
              {p.video_url && (
                <motion.div variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold flex items-center justify-center text-gold pulse-glow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </motion.div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-3">{p.category} — {p.year}</div>
                    <div className="font-display text-3xl md:text-5xl text-bone tracking-tight">{p.title}</div>
                    <div className="mt-1 font-sans text-xs md:text-sm text-bone/50">{p.client}</div>
                  </div>
                  <div className="hidden md:block font-mono text-[10px] tracking-[0.25em] text-bone/40 group-hover:text-gold transition-colors">
                    {p.video_url ? "PLAY →" : "VIEW →"}
                  </div>
                </div>
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <VideoModal url={video} onClose={() => setVideo(null)} />
    </section>
  );
}
