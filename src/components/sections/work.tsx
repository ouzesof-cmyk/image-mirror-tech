import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SectionLabel } from '@/components/section-label'
import { useLanguage } from '@/lib/language-context'
import { supabase } from '@/integrations/supabase/client'

const slugs = ['graphic-design', 'video-production', 'ad-campaigns', 'web-development', 'photography']
const fallbackImages = ['/images/project-1.jpg', '/images/project-2.jpg', '/images/project-3.jpg', '/images/project-4.jpg', '/images/project-5.jpg']

interface CarouselItem {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  media_type: string
}

export function WorkSection() {
  const { t, isRTL, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dynamicItems, setDynamicItems] = useState<CarouselItem[] | null>(null)

  useEffect(() => {
    supabase
      .from('portfolio_items')
      .select('id, category, title_en, title_fr, title_ar, media_url, media_type, display_order')
      .eq('show_in_carousel', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDynamicItems(
            data.map((d) => ({
              id: d.id,
              title: language === 'ar' ? d.title_ar : language === 'fr' ? d.title_fr : d.title_en,
              subtitle: d.category,
              image_url: d.media_url,
              slug: d.category,
              media_type: d.media_type,
            }))
          )
        } else {
          setDynamicItems(null)
        }
      })
  }, [language])

  const fallbackProjects = t.work.projects.map((p, i) => ({
    id: String(i + 1),
    title: p.title,
    subtitle: p.subtitle,
    image_url: fallbackImages[i],
    slug: slugs[i],
    media_type: 'image',
  }))
  const projects = dynamicItems ?? fallbackProjects

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], isRTL ? ['0%', '60%'] : ['0%', '-60%'])

  return (
    <section id="work" className="bg-background-secondary" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel japanese={t.work.label} code={t.work.code} title={t.work.title} />

          <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-sm sm:text-base leading-relaxed text-foreground-secondary ${isRTL ? 'text-right' : ''}`}
            >
              {t.work.paragraph}
            </motion.p>

            <div className={`flex items-start ${isRTL ? 'lg:justify-start' : 'lg:justify-end'}`}>
              <a href="#work"
                className={`group inline-flex items-center gap-2 text-xs sm:text-sm text-foreground transition-colors hover:text-accent-gold ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t.work.seeWorks}
                <span className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative h-[200vh] sm:h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className={`flex gap-4 sm:gap-8 ${isRTL ? 'pr-4 sm:pr-6 lg:pr-[15%] flex-row-reverse' : 'pl-4 sm:pl-6 lg:pl-[15%]'}`}
          >
            {projects.map((project, index) => (
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
                    {project.media_type === 'video' ? (
                      <video
                        src={project.image_url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                  </div>

                  <div className={`mt-4 sm:mt-6 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
    </section>
  )
}
