// @ts-nocheck
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useContent } from '@/hooks/use-content'

import hero from '@/assets/ouzesof/hero-fluid.jpg'
import portrait from '@/assets/ouzesof/portrait.jpg'
import aurum from '@/assets/ouzesof/work-aurum.jpg'
import noctis from '@/assets/ouzesof/work-noctis.jpg'
import monolith from '@/assets/ouzesof/work-monolith.jpg'
import velour from '@/assets/ouzesof/work-velour.jpg'
import ember from '@/assets/ouzesof/work-ember.jpg'

export const BG = '#ffffff'
export const CREAM = '#111111'
export const EMBER = '#c9a96e'
export const EMBER_GLOW = '#d8bd86'
export const MUTED = '#666666'
export const FAINT = 'rgba(17,17,17,0.10)'
export const FONT = '"Inter", system-ui, sans-serif'
export const SERIF = '"Playfair Display", Georgia, serif'
export const MONO = '"JetBrains Mono", monospace'

export type Project = {
  slug: string
  title: string
  client: string
  year: string
  category: string
  cover: string
  tags: string[]
  about: string
  section?: string | null
}

const FALLBACK_COVERS = [aurum, noctis, monolith, velour, ember]

export { hero, portrait }

function parseJSON<T>(s: string | undefined, fallback: T): T {
  if (!s) return fallback
  try { return JSON.parse(s) as T } catch { return fallback }
}
function parseList(s: string | undefined): string[] {
  return (s || '').split(',').map((x) => x.trim()).filter(Boolean)
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('category', 'graphic-design')
      .eq('published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length) {
          setProjects(
            data.map((p: any, i: number) => ({
              slug: p.id,
              title: p.title,
              client: p.client ?? p.title,
              year: p.year ?? '',
              category: 'Selected work',
              cover: p.image_url || FALLBACK_COVERS[i % FALLBACK_COVERS.length],
              tags: Array.isArray(p.tags) && p.tags.length ? p.tags : ['Identity'],
              about: '',
              section: p.section ?? null,
            })),
          )
        }
      })
  }, [])
  return projects
}

// ----------------- Section components -----------------

export function HeroSection() {
  const { t } = useContent()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  const headline = [
    t('gd.hero.headline.1', 'Designing'),
    t('gd.hero.headline.2', 'the silence'),
    t('gd.hero.headline.3', 'between'),
    t('gd.hero.headline.4', 'objects.'),
  ]

  return (
    <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
      <motion.div style={{ y: yParallax, scale }} className="absolute inset-0">
        <img src={hero} alt="" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BG}66 0%, ${BG}33 40%, ${BG} 100%)` }} />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 py-12 pt-28 md:px-10">
        <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>
          <div>
            <div>{t('gd.hero.studio_label', 'Studio · 011')}</div>
            <div style={{ color: 'rgba(17,17,17,0.4)' }}>{t('gd.hero.studio_est', 'Est. MMXIX')}</div>
          </div>
          <div className="text-right">
            <div>{t('gd.hero.availability', 'Available Q3 — 2026')}</div>
            <div style={{ color: 'rgba(17,17,17,0.4)' }}>{t('gd.hero.slots', '2 slots remaining')}</div>
          </div>
        </div>

        <div>
          <p className="mb-8 text-[11px] uppercase tracking-[0.3em]" style={{ color: EMBER, fontFamily: MONO }}>
            {t('gd.hero.eyebrow', '✺   Independent design practice')}
          </p>
          <h1 className="font-light leading-[0.88] tracking-[-0.02em]" style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 11vw, 11rem)' }}>
            {headline.map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
                  className="inline-block"
                >
                  {i === 3 ? <em style={{ color: EMBER, fontStyle: 'italic' }}>{word}</em> : word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className="flex items-end justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="max-w-sm text-sm" style={{ color: 'rgba(17,17,17,0.7)' }}
          >
            {t('gd.hero.tagline', 'An independent studio building cinematic brand systems for fragrance, fashion, hospitality and editorial.')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export function MarqueeSection({ projects }: { projects: Project[] }) {
  return (
    <section className="overflow-hidden border-y py-8" style={{ borderColor: FAINT }}>
      <div
        className="flex shrink-0 gap-16 whitespace-nowrap text-3xl italic"
        style={{ fontFamily: SERIF, animation: 'gd-marquee 40s linear infinite' }}
      >
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="flex shrink-0 gap-16">
            {projects.map((p, i) => (
              <span key={p.slug + k + i} className="flex items-center gap-16">
                <span>{p.client || p.title}</span>
                <span className="not-italic" style={{ color: EMBER }}>✺</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes gd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  )
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const { t } = useContent()
  return (
    <section id="gd-work" className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
      <div className="mb-20 flex items-end justify-between">
        <div>
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>
            {t('gd.work.eyebrow', '( 01 ) — Selected work')}
          </p>
          <h2 className="leading-[0.95] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('gd.work.title_pre', 'A small body of ')}
            <em style={{ color: EMBER, fontStyle: 'italic' }}>{t('gd.work.title_em', 'obsessive')}</em>
            {t('gd.work.title_post', ' work.')}
          </h2>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-24 md:grid-cols-12">
        {projects.filter((p) => (p.section ?? 'selected') === 'selected').slice(0, 4).map((p, i) => (
          <a key={p.slug} href="#" className={`group block ${i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5 md:mt-32'}`}>
            <div className="relative overflow-hidden" style={{ background: 'rgba(17,17,17,0.04)' }}>
              <motion.img src={p.cover} alt={p.title} loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <div>
                <h3 className="tracking-tight" style={{ fontFamily: SERIF, fontSize: '1.875rem' }}>
                  {p.title}{' '}
                  <span style={{ color: 'rgba(17,17,17,0.4)', fontStyle: 'italic', fontWeight: 300 }}>— {p.client}</span>
                </h3>
                <p className="mt-2 text-[11px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>
                  {p.category} · {p.year}
                </p>
              </div>
              <span className="text-xs" style={{ color: 'rgba(17,17,17,0.3)', fontFamily: MONO }}>0{i + 1}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export function BrandsSection({ projects }: { projects: Project[] }) {
  const { t } = useContent()
  const FILTERS = useMemo(() => {
    const list = parseList(t('gd.brands.filters', 'All, Identity, Packaging, Editorial, Lookbook'))
    return list.length ? list : ['All']
  }, [t])
  const [filter, setFilter] = useState<string>(FILTERS[0])
  useEffect(() => { if (!FILTERS.includes(filter)) setFilter(FILTERS[0]) }, [FILTERS, filter])
  const brandsOnly = projects.filter((p) => p.section === 'brands')
  const filtered = filter === 'All' ? brandsOnly : brandsOnly.filter((p) => p.tags?.includes(filter))
  return (
    <section id="gd-brands" className="border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-16 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>
          {t('gd.brands.eyebrow', '( 02 ) — Roster · clients & collaborators')}
        </p>
        <h2 className="mt-8 font-light leading-[0.9] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
          {t('gd.brands.title_pre', 'Brands we ')}
          <em style={{ color: EMBER, fontStyle: 'italic' }}>{t('gd.brands.title_em', 'shape.')}</em>
        </h2>
        <div className="mt-16 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="rounded-full border px-5 py-2 text-[11px] uppercase tracking-widest transition-all"
                style={{
                  borderColor: active ? EMBER : FAINT,
                  background: active ? EMBER : 'transparent',
                  color: active ? BG : 'rgba(17,17,17,0.7)',
                  fontFamily: MONO,
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 pb-32 md:px-10">
        <motion.div layout className="grid auto-rows-[160px] grid-cols-2 gap-4 md:grid-cols-6">
          {filtered.map((p, i) => {
            const spans = [
              'md:col-span-3 md:row-span-3',
              'md:col-span-3 md:row-span-2',
              'md:col-span-2 md:row-span-2',
              'md:col-span-2 md:row-span-3',
              'md:col-span-2 md:row-span-2',
            ]
            return (
              <motion.div key={p.slug} layout
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative col-span-2 row-span-2 ${spans[i % spans.length]}`}
              >
                <a href="#" className="group relative block h-full w-full overflow-hidden" style={{ background: 'rgba(17,17,17,0.04)' }}>
                  <img src={p.cover} alt={p.title} loading="lazy"
                    className="h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-110 group-hover:brightness-110" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BG} 0%, ${BG}55 30%, transparent 70%)`, opacity: 0.85 }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="tracking-tight transition-transform duration-500 group-hover:-translate-y-1"
                      style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)' }}>{p.client}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(17,17,17,0.6)', fontFamily: MONO }}>
                      {(p.tags || []).join(' · ')}
                    </p>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export function ArchiveSection({ projects }: { projects: Project[] }) {
  const { t } = useContent()
  const [hovered, setHovered] = useState<string | null>(null)
  const archiveOnly = projects.filter((p) => p.section === 'archive')
  return (
    <section id="gd-archive" className="border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1600px] px-6 pt-24 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>
          {t('gd.archive.eyebrow', '( 03 ) · Archive')} · {archiveOnly.length} projects
        </p>
        <h2 className="mt-8 font-light leading-[0.9] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
          {t('gd.archive.title_pre', 'Work, ')}
          <em style={{ color: EMBER, fontStyle: 'italic' }}>{t('gd.archive.title_em', 'unfiltered.')}</em>
        </h2>
      </div>

      <div className="mt-20 border-t" style={{ borderColor: FAINT }}>
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {archiveOnly.map((p, i) => (
            <a key={p.slug + i} href="#" onMouseEnter={() => setHovered(p.slug)} onMouseLeave={() => setHovered(null)}
              className="group relative block border-b py-10" style={{ borderColor: FAINT }}>
              <div className="grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-1 text-xs" style={{ color: MUTED, fontFamily: MONO }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="col-span-6 leading-none tracking-tight transition-all duration-700 group-hover:translate-x-4 md:col-span-5"
                  style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 6vw, 5rem)', color: hovered === p.slug ? EMBER : CREAM }}>
                  {p.title}
                </h3>
                <span className="col-span-3 hidden text-[11px] uppercase tracking-widest md:block" style={{ color: MUTED, fontFamily: MONO }}>{p.category}</span>
                <span className="col-span-2 hidden text-right text-[11px] uppercase tracking-widest md:block" style={{ color: MUTED, fontFamily: MONO }}>{p.year}</span>
                <span className="col-span-1 hidden text-right text-2xl transition-all md:block"
                  style={{ fontFamily: SERIF, color: hovered === p.slug ? EMBER : 'rgba(17,17,17,0.3)', transform: hovered === p.slug ? 'translateX(8px)' : 'none' }}>→</span>
              </div>
              <motion.div initial={false}
                animate={{ opacity: hovered === p.slug ? 1 : 0, scale: hovered === p.slug ? 1 : 0.9 }} transition={{ duration: 0.4 }}
                className="pointer-events-none absolute right-[15%] top-1/2 z-10 hidden h-72 w-56 -translate-y-1/2 overflow-hidden md:block">
                <img src={p.cover} alt="" className="h-full w-full object-cover" />
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  const { t } = useContent()
  const aboutRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: aboutProg } = useScroll({ target: aboutRef, offset: ['start end', 'end start'] })
  const portraitY = useTransform(aboutProg, [0, 1], [-80, 80])
  const timeline = parseJSON<{ y: string; t: string }[]>(t('gd.timeline.items', ''), [])
  const tools = parseList(t('gd.tools.items', ''))
  const disciplines = parseJSON<{ n: string; t: string; d: string }[]>(t('gd.disc.items', ''), [])
  return (
    <section id="gd-about" className="border-t pt-32" style={{ borderColor: FAINT }}>
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-32 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.about.eyebrow', '( 04 ) — Studio')}</p>
          <h2 className="mt-8 font-light leading-[0.95] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}>
            {t('gd.about.title_pre', 'A small studio with an ')}
            <em style={{ color: EMBER, fontStyle: 'italic' }}>{t('gd.about.title_em', 'obsessive')}</em>
            {t('gd.about.title_post', ' eye for type, light and silence.')}
          </h2>
          <div className="mt-12 max-w-xl space-y-6 text-lg" style={{ color: 'rgba(17,17,17,0.7)' }}>
            <p>{t('gd.about.body1', '')}</p>
            <p>{t('gd.about.body2', '')}</p>
          </div>
        </div>
        <div ref={aboutRef} className="md:col-span-4 md:col-start-9">
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img style={{ y: portraitY }} src={portrait} alt="Studio founder" loading="lazy" className="h-[120%] w-full object-cover" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.about.role', 'Founder · Creative Director')}</p>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: FAINT }}>
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
          <p className="mb-16 text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.timeline.eyebrow', '( 05 ) — Trajectory')}</p>
          <ol className="relative ml-8 border-l" style={{ borderColor: FAINT }}>
            {timeline.map((m, i) => (
              <motion.li key={m.y + i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative grid grid-cols-12 gap-6 py-10 pl-12">
                <span className="absolute -left-[7px] top-12 h-3 w-3 rounded-full" style={{ background: EMBER }} />
                <span className="col-span-2 text-sm" style={{ color: EMBER, fontFamily: MONO }}>{m.y}</span>
                <span className="col-span-10 tracking-tight md:text-3xl" style={{ fontFamily: SERIF, fontSize: '1.5rem' }}>{m.t}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: FAINT, background: 'rgba(17,17,17,0.02)' }}>
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
          <p className="mb-12 text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.tools.eyebrow', '( 06 ) — Tools of the trade')}</p>
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-6 leading-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            {tools.map((tool, i) => (
              <span key={tool + i} className="cursor-default transition-colors hover:opacity-80" style={{ color: CREAM }}>
                {tool}{i < tools.length - 1 && <span className="ml-10" style={{ color: 'rgba(17,17,17,0.3)' }}>/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="border-t" style={{ borderColor: FAINT }}>
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.disc.eyebrow', '( 07 ) — Disciplines')}</p>
          <div className="grid gap-y-8 md:grid-cols-12">
            {disciplines.map((s, i) => (
              <div key={s.n + i} className="group col-span-6 border-t py-8 transition-colors" style={{ borderColor: FAINT }}>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs" style={{ color: MUTED, fontFamily: MONO }}>{s.n}</span>
                  <div className="flex-1">
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.875rem' }}>{s.t}</h3>
                    <p className="mt-3 max-w-md text-sm" style={{ color: 'rgba(17,17,17,0.6)' }}>{s.d}</p>
                  </div>
                  <span className="text-2xl opacity-0 transition-opacity group-hover:opacity-100" style={{ color: EMBER, fontFamily: SERIF }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export function ContactSection() {
  const { t } = useContent()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const social = parseJSON<{ label: string; url: string }[]>(t('gd.contact.social', ''), [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return toast.error('Please fill in name, email and message')
    setBusy(true)
    // Lightweight: store as a content row keyed by timestamp
    const body = company ? `[${company}]\n\n${message}` : message
    const k = `gd.msg.${Date.now()}`
    const { error } = await supabase.from('site_content').insert({ key: k, value: JSON.stringify({ name, email, body }) })
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Transmission sent. We reply within two working days.')
    setName(''); setEmail(''); setCompany(''); setMessage('')
  }

  const F = (label: string, val: string, setVal: (v: string) => void, type = 'text', area = false) => (
    <label className="group block border-b pb-3 transition-colors" style={{ borderColor: FAINT }}>
      <span className="block text-[10px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>{label}</span>
      {area ? (
        <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3}
          className="mt-2 w-full resize-none bg-transparent text-xl outline-none" style={{ color: CREAM }} placeholder="Tell us about it..." />
      ) : (
        <input type={type} value={val} onChange={(e) => setVal(e.target.value)}
          className="mt-2 w-full bg-transparent text-xl outline-none" style={{ color: CREAM }} placeholder="—" />
      )}
    </label>
  )

  return (
    <section id="gd-contact" className="border-t" style={{ borderColor: FAINT }}>
      <div className="mx-auto max-w-[1600px] px-6 pt-32 pb-20 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: MUTED, fontFamily: MONO }}>{t('gd.contact.eyebrow', '( 08 ) — Start a project')}</p>
        <h2 className="mt-8 font-light leading-[0.85] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 12vw, 11rem)' }}>
          {t('gd.contact.title_pre', 'Say ')}
          <em style={{ color: EMBER, fontStyle: 'italic' }}>{t('gd.contact.title_em', 'hello.')}</em>
        </h2>
        <p className="mt-8 max-w-md text-lg" style={{ color: 'rgba(17,17,17,0.7)' }}>
          {t('gd.contact.intro', '')}
        </p>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 pb-32 md:grid-cols-12 md:px-10">
        <form onSubmit={submit} className="space-y-10 md:col-span-7">
          {F('Name', name, setName)}
          {F('Email', email, setEmail, 'email')}
          {F('Company / Brand', company, setCompany)}
          {F('Tell us about the project', message, setMessage, 'text', true)}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={busy}
            className="group inline-flex items-center gap-4 rounded-full px-8 py-4 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            style={{ background: EMBER, color: BG, fontFamily: MONO }}
            onMouseEnter={(e) => (e.currentTarget.style.background = EMBER_GLOW)}
            onMouseLeave={(e) => (e.currentTarget.style.background = EMBER)}
          >
            {busy ? 'Sending…' : 'Send transmission'}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </form>

        <aside className="space-y-12 md:col-span-4 md:col-start-9">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>Direct</p>
            <a href={`mailto:${t('gd.contact.email', '')}`} className="inline-block transition-colors hover:opacity-80" style={{ fontFamily: SERIF, fontSize: '1.5rem', color: CREAM }}>
              {t('gd.contact.email', 'hello@ouzesof.studio')}
            </a>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>Studio</p>
            <p style={{ fontFamily: SERIF, fontSize: '1.5rem' }}>{t('gd.contact.city', 'Algiers, DZ')}</p>
            <p className="mt-1 text-sm" style={{ color: 'rgba(17,17,17,0.6)' }}>{t('gd.contact.city_note', 'By appointment only')}</p>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-widest" style={{ color: MUTED, fontFamily: MONO }}>Elsewhere</p>
            <ul className="space-y-2" style={{ fontFamily: SERIF, fontSize: '1.5rem' }}>
              {social.map((s, i) => (
                <li key={s.label + i}>
                  <a href={s.url || '#'} className="inline-block transition-transform hover:translate-x-2" style={{ color: CREAM }}>{s.label} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
