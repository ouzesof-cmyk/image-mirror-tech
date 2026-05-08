import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { SectionLabel } from '@/components/section-label'
import { createClient } from '@/lib/supabase/client'

type PortfolioItem = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  slug: string
  display_order: number
  display_mode: 'carousel' | 'grid' | 'both'
}

// Fallback projects for when database is not available
const fallbackProjects = [
  {
    id: '1',
    title: 'Graphic Design',
    subtitle: 'Visual Identity & Branding',
    image_url: '/images/project-1.jpg',
    slug: 'graphic-design',
    display_order: 1,
    display_mode: 'carousel' as const,
  },
  {
    id: '2',
    title: 'Video Production',
    subtitle: 'Motion & Storytelling',
    image_url: '/images/project-2.jpg',
    slug: 'video-production',
    display_order: 2,
    display_mode: 'carousel' as const,
  },
  {
    id: '3',
    title: 'Ad Campaigns',
    subtitle: 'Strategic Marketing',
    image_url: '/images/project-3.jpg',
    slug: 'ad-campaigns',
    display_order: 3,
    display_mode: 'carousel' as const,
  },
  {
    id: '4',
    title: 'Web Development',
    subtitle: 'Digital Experiences',
    image_url: '/images/project-4.jpg',
    slug: 'web-development',
    display_order: 4,
    display_mode: 'carousel' as const,
  },
  {
    id: '5',
    title: 'Photography',
    subtitle: 'Light, Composition & Emotion',
    image_url: '/images/project-5.jpg',
    slug: 'photography',
    display_order: 5,
    display_mode: 'carousel' as const,
  },
]

export function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<PortfolioItem[]>(fallbackProjects)
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id, title, subtitle, image_url, slug, display_order, display_mode')
          .eq('is_visible', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching portfolio items:', error)
          return
        }

        if (data && data.length > 0) {
          setProjects(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const carouselItems = projects.filter(p => p.display_mode === 'carousel' || p.display_mode === 'both')
  const gridItems = projects.filter(p => p.display_mode === 'grid' || p.display_mode === 'both')

  return (
    <section id="work" className="bg-background-secondary">
      <div className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel 
            japanese="Our Work" 
            code="(OZS — 03)" 
            title="Portfolio"
          />
          
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm sm:text-base leading-relaxed text-foreground-secondary"
            >
              Every project is a chance to blend design and development, shaping bold interactive ideas into sleek digital realities — built with intent, speed, and visual clarity that attracts audiences.
            </motion.p>
            
            <div className="flex items-start lg:justify-end">
              <a href="#work"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.15em] text-foreground transition-colors hover:text-accent-gold"
              >
                SEE WORKS
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section - Shows items with display_mode 'grid' or 'both' */}
      {gridItems.length > 0 && (
        <div className="px-4 sm:px-6 pb-12 sm:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {gridItems.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <a href={`/portfolio/${project.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={project.image_url || '/images/placeholder.jpg'}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                    </div>
                    <div className="mt-2 sm:mt-4">
                      <h3 className="font-serif text-sm sm:text-xl text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-foreground-secondary truncate">
                        {project.subtitle}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Horizontal Scroll Section - Shows items with display_mode 'carousel' or 'both' */}
      {carouselItems.length > 0 && (
        <div ref={containerRef} className="relative h-[200vh] sm:h-[300vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x }} className="flex gap-4 sm:gap-8 pl-4 sm:pl-6 lg:pl-[15%]">
              {carouselItems.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative flex-shrink-0"
                >
                  <a href={`/portfolio/${project.slug}`} className="block">
                    <div className="relative aspect-[3/4] w-[260px] sm:w-[350px] overflow-hidden bg-muted lg:w-[450px]">
                      <img
                        src={project.image_url || '/images/placeholder.jpg'}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 350px, 450px"
                      />
                      <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                    </div>
                    
                    <div className="mt-4 sm:mt-6 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <h3 className="font-serif text-lg sm:text-2xl text-foreground">
                            {project.title}
                          </h3>
                          <span className="text-xs sm:text-sm text-foreground-secondary">
                            ({String(index + 1).padStart(2, '0')})
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </section>
  )
}
