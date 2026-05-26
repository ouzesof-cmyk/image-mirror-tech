// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Play, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

type VP = {
  id: string
  title: string
  tagline: string | null
  description: string | null
  client: string | null
  year: number | null
  video_url: string | null
  poster_image: string | null
  layout_style: string
  fullscreen: boolean
  autoplay: boolean
  hover_play: boolean
  accent_color: string | null
  sort_order: number
  media_type?: string | null
  category?: string | null
}

type BTS = { id: string; image_url: string; caption: string | null }

type Settings = {
  hero_video_url: string
  hero_poster: string
  hero_title: string
  hero_subtitle: string
  hero_cta_label: string
  hero_cta_video: string
  reel_enabled: boolean
  reel_video_url: string
  reel_title: string
  bts_enabled: boolean
  bts_title: string
  final_cta_enabled: boolean
  final_cta_title: string
  final_cta_label: string
  final_cta_link: string
  accent_color: string
  heading_font: string
  body_font: string
  seo_title: string
  seo_description: string
  seo_og_image: string
}

const DEFAULTS: Settings = {
  hero_video_url: '',
  hero_poster: '',
  hero_title: 'OUZESOF',
  hero_subtitle: 'Commercial Films & Visual Advertising',
  hero_cta_label: 'Watch Reel',
  hero_cta_video: '',
  reel_enabled: true,
  reel_video_url: '',
  reel_title: 'The Showreel',
  bts_enabled: true,
  bts_title: 'Behind the Scenes',
  final_cta_enabled: true,
  final_cta_title: "Let's Create Something Cinematic",
  final_cta_label: 'Start a Project',
  final_cta_link: '/#contact',
  accent_color: '#D4AF37',
  heading_font: 'serif',
  body_font: 'sans-serif',
  seo_title: 'Video Production — Ouzesof',
  seo_description: 'Cinematic commercial films & visual advertising.',
  seo_og_image: '',
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null
    }
  } catch { /* ignore */ }
  return null
}

function isExternalMedia(p: { media_type?: string | null; video_url?: string | null }) {
  if (p.media_type === 'external') return true
  if (!p.video_url) return false
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(p.video_url)
}

export function VideoProductionPage({ category = 'video-production' }: { category?: string } = {}) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [projects, setProjects] = useState<VP[]>([])
  const [bts, setBts] = useState<BTS[]>([])
  const [lightbox, setLightbox] = useState<{ url: string; external: boolean } | null>(null)

  useEffect(() => {
    document.title = settings.seo_title || DEFAULTS.seo_title
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); return m
    })()
    meta.setAttribute('content', settings.seo_description || DEFAULTS.seo_description)
  }, [settings.seo_title, settings.seo_description])

  useEffect(() => {
    supabase.from('site_content').select('content').eq('section', 'video_production_page').maybeSingle()
      .then(({ data }) => { if (data?.content) setSettings({ ...DEFAULTS, ...(data.content as any) }) })
    supabase.from('video_projects').select('*').eq('published', true).eq('category', category).order('sort_order')
      .then(({ data }) => setProjects((data ?? []) as VP[]))
    supabase.from('behind_the_scenes').select('id,image_url,caption').eq('visible', true).order('sort_order')
      .then(({ data }) => setBts((data ?? []) as BTS[]))
  }, [category])

  const accent = settings.accent_color || '#D4AF37'

  return (
    <main className="relative bg-black text-white overflow-x-hidden" style={{ ['--accent' as any]: accent }}>
      <Link to="/" className="fixed left-6 top-6 z-50 inline-flex items-center gap-2 text-xs tracking-[0.25em] text-white/60 backdrop-blur-md px-3 py-2 rounded-full bg-white/5 hover:text-white transition">
        <ArrowLeft className="h-3.5 w-3.5" /> BACK
      </Link>

      {/* HERO */}
      <Hero settings={settings} onPlayReel={() => {
        const url = settings.hero_cta_video || settings.reel_video_url
        if (url) setLightbox({ url, external: !!toEmbedUrl(url) })
      }} />

      {/* PROJECTS — continuous cinematic scroll */}
      {projects.length === 0 ? (
        <section className="py-40 text-center">
          <p className="text-xs tracking-[0.3em] text-white/30">NO PROJECTS YET — ADD FROM THE ADMIN PANEL</p>
        </section>
      ) : (
        <div>
          {projects.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} onOpen={() => p.video_url && setLightbox({ url: p.video_url, external: isExternalMedia(p) })} />
          ))}
        </div>
      )}

      {/* SHOWREEL */}
      {settings.reel_enabled && settings.reel_video_url && (
        <Showreel title={settings.reel_title} url={settings.reel_video_url} onOpen={() => setLightbox({ url: settings.reel_video_url, external: !!toEmbedUrl(settings.reel_video_url) })} />
      )}

      {/* BEHIND THE SCENES */}
      {settings.bts_enabled && bts.length > 0 && (
        <BehindScenes title={settings.bts_title} items={bts} />
      )}

      {/* FINAL CTA */}
      {settings.final_cta_enabled && (
        <FinalCTA title={settings.final_cta_title} label={settings.final_cta_label} link={settings.final_cta_link} />
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X className="h-6 w-6" />
            </button>
            {lightbox.external ? (
              <iframe
                src={toEmbedUrl(lightbox.url) || lightbox.url}
                className="w-full max-w-6xl aspect-video rounded-md shadow-2xl"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video src={lightbox.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-md shadow-2xl" onClick={(e) => e.stopPropagation()} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Hero({ settings, onPlayReel }: { settings: Settings; onPlayReel: () => void }) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {settings.hero_video_url ? (
        <video
          src={settings.hero_video_url}
          poster={settings.hero_poster || undefined}
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : settings.hero_poster ? (
        <img src={settings.hero_poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[10px] sm:text-xs tracking-[0.5em] text-white/50 mb-8"
        >
          OUZESOF · CINEMATIC ADVERTISING
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-6xl sm:text-8xl md:text-[10rem] leading-[0.9] tracking-[0.05em] text-white"
        >
          {settings.hero_title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
          className="mt-8 max-w-xl text-sm sm:text-base text-white/70 tracking-wide"
        >
          {settings.hero_subtitle}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }}
          onClick={onPlayReel}
          className="mt-12 group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-7 py-3.5 text-xs tracking-[0.3em] hover:bg-white/10 transition"
        >
          <span className="grid place-items-center h-7 w-7 rounded-full" style={{ background: 'var(--accent)' }}>
            <Play className="h-3 w-3 text-black fill-black" />
          </span>
          {settings.hero_cta_label}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-white/40"
      >
        SCROLL
      </motion.div>
    </section>
  )
}

function ProjectBlock({ project, index, onOpen }: { project: VP; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

  const onEnter = () => { if (project.hover_play && videoRef.current) videoRef.current.play().catch(() => {}) }
  const onLeave = () => { if (project.hover_play && videoRef.current && !project.autoplay) { videoRef.current.pause(); videoRef.current.currentTime = 0 } }

  const num = String(index + 1).padStart(2, '0')
  const layout = project.layout_style || 'fullscreen'
  const external = isExternalMedia(project)

  const Media = (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950 cursor-pointer group" onClick={onOpen} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {project.video_url && !external ? (
        <motion.video
          ref={videoRef}
          src={project.video_url}
          poster={project.poster_image || undefined}
          muted loop playsInline
          autoPlay={project.autoplay}
          style={{ scale }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : project.poster_image ? (
        <motion.img src={project.poster_image} alt={project.title} style={{ scale }} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
      <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="grid place-items-center h-20 w-20 rounded-full backdrop-blur-md bg-white/10 border border-white/30">
          <Play className="h-6 w-6 text-white fill-white" />
        </div>
      </div>
    </div>
  )

  if (layout === 'split-left' || layout === 'split-right') {
    const reverse = layout === 'split-right'
    return (
      <section ref={ref} className="min-h-screen flex items-center py-24 px-6 sm:px-12">
        <div className={`mx-auto w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <motion.div style={{ y, opacity }} className="aspect-[4/5] lg:aspect-[3/4]">{Media}</motion.div>
          <motion.div initial={{ opacity: 0, x: reverse ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className="text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--accent)' }}>FILM — {num}</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-6">{project.title}</h2>
            {project.tagline && <p className="text-lg text-white/70 mb-6 italic">{project.tagline}</p>}
            {project.description && <p className="text-sm text-white/50 leading-relaxed max-w-md">{project.description}</p>}
            <div className="mt-8 flex gap-8 text-[10px] tracking-[0.3em] text-white/40">
              {project.client && <span>CLIENT · {project.client}</span>}
              {project.year && <span>{project.year}</span>}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (layout === 'oversized-type') {
    return (
      <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
          className="absolute inset-0 grid place-items-center font-serif text-[20vw] leading-none text-white/[0.04] pointer-events-none select-none whitespace-nowrap"
        >
          {project.title}
        </motion.h2>
        <motion.div style={{ y, opacity }} className="relative z-10 w-[88vw] max-w-5xl aspect-video rounded-sm overflow-hidden shadow-2xl">{Media}</motion.div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
          <p className="text-xs tracking-[0.4em]" style={{ color: 'var(--accent)' }}>{num} — {project.tagline || project.client || ''}</p>
        </div>
      </section>
    )
  }

  if (layout === 'floating-text') {
    return (
      <section ref={ref} className="relative min-h-screen overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">{Media}</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 z-10"
        >
          <p className="text-xs tracking-[0.4em] mb-4" style={{ color: 'var(--accent)' }}>{num} / FILM</p>
          <h2 className="font-serif text-6xl md:text-8xl max-w-3xl leading-[0.95]">{project.title}</h2>
          {project.tagline && <p className="mt-4 max-w-lg text-white/70">{project.tagline}</p>}
        </motion.div>
      </section>
    )
  }

  if (layout === 'parallax') {
    return (
      <section ref={ref} className="relative min-h-[120vh] overflow-hidden">
        <motion.div style={{ y: parallaxY }} className="absolute inset-0">{Media}</motion.div>
        <div className="relative z-10 h-screen flex items-center justify-center text-center px-6">
          <div>
            <p className="text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--accent)' }}>FILM {num}</p>
            <h2 className="font-serif text-5xl md:text-8xl drop-shadow-2xl">{project.title}</h2>
            {project.tagline && <p className="mt-6 text-white/70 max-w-xl mx-auto">{project.tagline}</p>}
          </div>
        </div>
      </section>
    )
  }

  // fullscreen default
  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">{Media}</div>
      <motion.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 flex justify-between items-end z-10 gap-6"
      >
        <div>
          <p className="text-xs tracking-[0.4em] mb-3" style={{ color: 'var(--accent)' }}>{num} — FILM</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-none">{project.title}</h2>
          {project.tagline && <p className="mt-3 text-white/70 max-w-md">{project.tagline}</p>}
        </div>
        <div className="text-right text-[10px] tracking-[0.3em] text-white/40 hidden sm:block">
          {project.client && <div>{project.client}</div>}
          {project.year && <div className="mt-1">{project.year}</div>}
        </div>
      </motion.div>
    </section>
  )
}

function Showreel({ title, url, onOpen }: { title: string; url: string; onOpen: () => void }) {
  return (
    <section className="relative py-40 px-6">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--accent)' }}>SHOWREEL</p>
        <h2 className="font-serif text-5xl md:text-7xl mb-12">{title}</h2>
        <div onClick={onOpen} className="relative aspect-video w-full rounded-sm overflow-hidden cursor-pointer group bg-zinc-950 shadow-2xl">
          <video src={url} muted loop autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid place-items-center h-24 w-24 rounded-full backdrop-blur-md bg-white/10 border border-white/40 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BehindScenes({ title, items }: { title: string; items: BTS[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-25%'])
  return (
    <section ref={ref} className="py-32 overflow-hidden">
      <div className="px-6 mb-16 text-center">
        <p className="text-xs tracking-[0.4em] mb-4" style={{ color: 'var(--accent)' }}>UNSEEN</p>
        <h2 className="font-serif text-5xl md:text-7xl">{title}</h2>
      </div>
      <motion.div style={{ x }} className="flex gap-6 px-6">
        {items.map((b, i) => (
          <motion.div key={b.id}
            initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (i % 4) * 0.1 }}
            className={`flex-shrink-0 ${i % 3 === 0 ? 'w-[420px] aspect-[4/5]' : i % 3 === 1 ? 'w-[520px] aspect-video' : 'w-[360px] aspect-square'}`}
          >
            <div className="relative h-full w-full overflow-hidden bg-zinc-950">
              <img src={b.image_url} alt={b.caption || ''} className="absolute inset-0 h-full w-full object-cover" />
              {b.caption && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-xs tracking-wider">{b.caption}</div>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function FinalCTA({ title, label, link }: { title: string; label: string; link: string }) {
  return (
    <section className="relative py-48 px-6 text-center overflow-hidden border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 0.15, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
        className="absolute inset-0 grid place-items-center pointer-events-none"
      >
        <div className="h-[600px] w-[600px] rounded-full blur-3xl" style={{ background: 'var(--accent)' }} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1 }}
        className="relative font-serif text-5xl md:text-8xl max-w-5xl mx-auto leading-[0.95]"
      >
        {title}
      </motion.h2>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
        <a href={link} className="relative inline-flex items-center gap-3 mt-12 rounded-full border border-white/20 bg-white text-black px-9 py-4 text-xs tracking-[0.3em] hover:bg-white/90 transition">
          {label} →
        </a>
      </motion.div>
    </section>
  )
}