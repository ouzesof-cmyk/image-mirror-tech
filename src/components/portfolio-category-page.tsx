// @ts-nocheck
import { motion } from 'framer-motion'
import { Link } from '@/components/link'
import { Image } from '@/components/image'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Carousel3D } from '@/components/carousel-3d'

type Project = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  client: string | null
  year: number | null
}

export function PortfolioCategoryPage({
  title,
  subtitle,
  category,
}: {
  title: string
  subtitle: string
  category: string
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [aspects, setAspects] = useState<Record<string, number>>({})

  useEffect(() => {
    supabase
      .from('portfolio_projects')
      .select('id,title,slug,description,cover_image,client,year')
      .eq('category', category)
      .eq('published', true)
      .eq('display_type', 'grid')
      .order('sort_order')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data ?? []) as Project[])
        setLoading(false)
      })
  }, [category])

  return (
    <main className="relative bg-black min-h-screen pb-24">
      <Link
        href="/#work"
        className="fixed left-6 top-8 z-50 inline-flex items-center gap-2 text-sm tracking-[0.15em] text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        BACK
      </Link>

      <section className="flex items-center justify-center text-center px-[12px] pt-32 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm tracking-[0.2em] text-white/40">PORTFOLIO</p>
          <h1 className="mt-6 font-serif text-5xl text-white md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-xl mx-auto text-white/60">{subtitle}</p>
        </motion.div>
      </section>

      <Carousel3D category={category} />

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="text-center text-white/40 text-xs tracking-[0.2em]">LOADING…</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-white/30 text-xs tracking-[0.2em]">
              NO PROJECTS YET — ADD SOME FROM THE ADMIN PANEL
            </p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {projects.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group flex flex-col"
                  style={{
                    flexGrow: aspects[p.id] ?? 1,
                    flexBasis: `${(aspects[p.id] ?? 1) * 320}px`,
                  }}
                >
                  <div className="relative overflow-hidden bg-white/5 flex-1">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        onLoad={(e) => {
                          const img = e.currentTarget
                          setAspects((a) =>
                            a[p.id] ? a : { ...a, [p.id]: img.naturalWidth / img.naturalHeight },
                          )
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ aspectRatio: aspects[p.id] || undefined }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="aspect-[4/5] flex items-center justify-center text-white/20 text-xs tracking-widest">
                        NO IMAGE
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl text-white truncate">{p.title}</h3>
                      {p.client && (
                        <p className="mt-1 text-xs tracking-[0.15em] text-white/50">{p.client}</p>
                      )}
                      {p.description && (
                        <p className="mt-2 text-sm text-white/60 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                    {p.year && <span className="text-xs text-white/40">{p.year}</span>}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
